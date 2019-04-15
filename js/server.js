const http = require("http").createServer(handler);
const fs = require("fs");
const io = require("socket.io")(http);
const Gpio = require("onoff").Gpio;
const pushButton1 = new Gpio(4, "in", "both");
const pushButton2 = new Gpio(6, "in", "both");
const mcpadc = require("mcp-spi-adc");

http.listen(5000);

function handler(req, res) {
  fs.readFile(__dirname + "/index.html", function(err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 Not Found");
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
}

io.sockets.on("connection", function(socket) {
  pushButton1.watch(function(err, value) {
    if (err) {
      console.error("There was an error", err);
      return;
    }
    socket.emit("cool", value);
  });
  pushButton2.watch(function(err, value) {
    if (err) {
      console.error("There was an error", err);
      return;
    }
    socket.emit("heat", value);
  });

  const tempSensor = mcpadc.open(0, { speedHz: 20000 }, err => {
    if (err) throw err;

    setInterval(() => {
      tempSensor.read((err, reading) => {
        let tempReading = Math.round(100 * ((reading.value * 3003) / 1024));
        socket.emit("temp", tempReading);
      }, 1000);
    });
  });
});

process.on("SIGINT", function() {
  pushButton1.unexport();
  pushButton2.unexport();
  process.exit();
});
