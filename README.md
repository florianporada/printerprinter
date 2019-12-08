# Printer Boi

## Description

Printer boi is a standalone/companion project for connecting a raspberrypi zero attached thermal printer via socket.io to an exisiting nodejs environment

## Installation

Lorem erat tortor habitant integer ante lacinia

### Client

#### Install

- Follow the instruction in the link below to set up your raspberry pi\
  **[Install RaspberryPi](https://styxit.com/2017/03/14/headless-raspberry-setup.html)**

- Add `wpa_supplicant.conf` in your newly flashed SD-Card

```config
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="your_real_wifi_ssid"
    scan_ssid=1
    psk="your_real_password"
    key_mgmt=WPA-PSK
}
```

- Run `sh scripts/install_client.sh`

- Add `$GITHUB_ACCESS_TOKEN=<gist-enabled-access-token> scripts/post_ip_gist.sh` to run during boot to get the ip of the printer (headless)

#### Example

##### Automatic

You can either use a .env file to configure the printer or use a lowdb file for get/set the configuration.
Set PRINTER_CONFIG_MODE to 'db' or 'env' to switch between the two modes.

- define .env vars

```dotenv
PRINTER_CONFIG_MODE='<db|env>'
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

```javascript
import PrinterClient from "../src/client/index"; // import path will change

const printer = new PrinterClient({
  url: "http://socketurl:3030", // points to the socketserver explained below
  name: "Printy McPrintface",
  uid: 0,
  baudrate: 9600,
  serialport: "/dev/ttyS0",
  ledpin: 12
});

printer.init();
```

### Server

Lorem erat tortor habitant integer ante lacinia

#### Usage

To initialize the service

```javascript
import PrinterService from "../src/server/index"; // import path will change

const printerService = new PrinterService({
  port: 3030 // defines the port for the socket service
});

printerService.init();
```

To send something to the printer:

```javascript
printerService
  .print({ message: { text: "foo", sender: "bar" }, printerUid: 0 })
  .then(res => console.log(res))
  .catch(err => console.log(err));
```

### Credits

- [Adafruit](https://github.com/adafruit/Python-Thermal-Printer)
