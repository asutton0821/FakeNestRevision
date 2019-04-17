var http = require("http").createServer(handler); //require http server, and create server with function handler()
var fs = require("fs"); //require filesystem module
var io = require("socket.io")(http); //require socket.io module and pass the http object (server)
var Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
var pushButton1 = new Gpio(4, "in", "both"); //switch at GPIO 4
var pushButton2 = new Gpio(6, "in", "both"); //switch at GPIO 6
const mcpadc = require("mcp-spi-adc"); //requires the mcp-spi-adc module

http.listen(5000); //listen to port 5000

function handler(req, res) {
  //create server
  fs.readFile(__dirname + "/public/index.html", function(err, data) {
    //read file index.html in public folder
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" }); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, { "Content-Type": "text/html" }); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on("connection", function(socket) {
  // WebSocket Connection
  pushButton1.watch(function(err, value) {
    //Watch for hardware interrupts on pushButton
    if (err) {
      //if an error
      console.error("There was an error", err); //output error message to console
      return;
    }
    socket.emit("cool", value); //send button status to client
  });
  pushButton2.watch(function(err, value) {
    //Watch for hardware interrupts on pushButton
    if (err) {
      //if an error
      console.error("There was an error", err); //output error message to console
      return;
    }
    socket.emit("heat", value); //send button status to client
  });

  const tempSensor = mcpadc.open(0, { speedHz: 20000 }, err => {
    if (err) throw err;

    setInterval(() => {
      tempSensor.read((err, reading) => {
        var newValue = 100 * (reading.value * 3003/1024);
	var valueRounded = Math.round(newValue) //round to nearest value
 //	console.log(valueRounded); //show on console for testing
	socket.emit("temp",valueRounded); //send to client
     }, 1000 ); //change this for a better interval
    });
  });
});

process.on("SIGINT", function() {
  pushButton1.unexport(); // Unexport Button GPIO to free resources
  pushButton2.unexport();
  process.exit(); 
});
