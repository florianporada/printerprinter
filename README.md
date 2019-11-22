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

- Add `$GITHUB_ACCESS_TOKEN=<gist-enabled-access-token> scripts/install_client.sh` to run during boot to get the ip of the printer (headless)

##### Example

```
import PrinterClient from '../src/client/index';

const printer = new PrinterClient({
  url: 'http://192.168.178.20:3030',
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
