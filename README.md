# Printer Boi

## Description

Printer boi is a standalone/companion project for connecting a raspberrypi zero attached thermal printer via socket.io to an exisiting nodejs environment

## Installation

Lorem erat tortor habitant integer ante lacinia

### Client

#### Install

- Follow the instruction in the link below to set up your raspberry pi\
  **[Install RaspberryPi](https://styxit.com/2017/03/14/headless-raspberry-setup.html)**

- Run `sh scripts/install_client.sh`

- Add `$GITHUB_ACCESS_TOKEN=<gist-enabled-access-token> scripts/post_ip_gist.sh` to run during boot to get the ip of the printer (headless)

##### Example

##### Automatic

- define .env vars

```
PRINTER_SOCKET_URL='http://socketurl:3030/'
PRINTER_WEBSERVER_PORT=8080
PRINTER_NAME='Printy McPrintface'
PRINTER_UID=0
PRINTER_BAUDRATE=9600
PRINTER_SERIALPORT='/dev/ttyS0'
PRINTER_LED=12
```

- start client via `npm start serve:client`

##### Manual

```
import PrinterClient from '../src/client/index';

const printer = new PrinterClient({
  url: 'http://socketurl:3030',
  name: 'Printy McPrintface',
  uid: 0,
  baudrate: 9600,
  serialport: '/dev/ttyS0',
  ledpin: 12
});

printer.init();

```

### Server

Lorem erat tortor habitant integer ante lacinia

### Credits

- [Adafruit](https://github.com/adafruit/Python-Thermal-Printer)
