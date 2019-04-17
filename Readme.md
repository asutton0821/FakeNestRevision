Nest Made From Raspberry Pi

RASP PI Usage ONLY:

Install nodejs:

sudo apt-get install nodejs

Install npm:

sudo apt-get install npm

Node packages needed:

sudo npm install onoff

sudo npm install socketio

sudo npm install mcp-spi-adc

To run the webserver:

sudo node webserver.js

Hardware Configurations:

Enable SPI (hardware mode)

https://learn.adafruit.com/raspberry-pi-analog-to-digital-converters/mcp3008 <- Change this to HW mode, not software... only HW works with JS

https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/ <--- For testing with Python

See HW Diagram for wiring instructions: NOT readily available online!!!
