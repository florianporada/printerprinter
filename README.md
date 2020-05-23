# PrinterPrinter

![printerprinter](https://repository-images.githubusercontent.com/219359224/39577000-9c80-11ea-94f6-5e725a4249c4 "printerprinter")

## Description

PrinterPrinter is a standalone/companion project for connecting a raspberrypi zero attached thermal printer via socket.io to an exisiting nodejs environment

## Installation

### Client

### Build

- Instructions for building the physical client coming soon ...

#### Install

- Follow the instruction in the link below to set up your raspberry pi\
  **[Install RaspberryPi](https://styxit.com/2017/03/14/headless-raspberry-setup.html)**

- Add a empty file named`ssh` to the `/boot` directory of the SD Card
- Add a `wpa_supplicant.conf` to the `/boot` directory of the SD Card with the following content:

```config
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="<YOUR_WIFI_SSID>"
    scan_ssid=1
    psk="<YOUR_WIFI_PASSWORD>"
    key_mgmt=WPA-PSK
}
```

- Run this command to install and configure the client

```sh
wget -O - https://raw.githubusercontent.com/florianporada/printerprinter/master/scripts/install_client.sh | bash
```

- (Optional) Add `$GITHUB_ACCESS_TOKEN=<gist-enabled-access-token> scripts/post_ip_gist.sh` to run during boot to get the ip of the printer (headless)

#### Usage

##### Automatic

If you use the install script above, the client will install all necessary packages and configure the service to run on startup.
You can go to `http://<ip-of-client>:8080/` to configure printerprinter client.

##### Manual

You can either use a `.env` file to configure the printer or use a lowdb file for get/set the configuration.
Set PRINTER_CONFIG_MODE to **db** or **env** to switch between the two modes.

```sh
PRINTER_CONFIG_MODE='<db|env>' # mode for handling the config
PRINTER_SOCKET_URL='http://socketurl:3030/' # URL to the service
PRINTER_WEBSERVER_PORT=8080 # Port for the web ui
PRINTER_NAME='Printy McPrintface'
PRINTER_UID=0 # Identifier for the service when sending a job
PRINTER_BAUDRATE=9600 # Baudrate of the printer
PRINTER_SERIALPORT='/dev/ttyS0' # Port where printer is connected
PRINTER_LED=12 # Pin of the info LED
```

- Install `printerprinter` via npm

```sh
npm i printerprinter
```

- Initialize the client component in your codebase.

```javascript
import { PrinterClient } from "printerprinter";

const printer = new PrinterClient({
  url: "http://socketurl:3030", // points to the socketserver explained below
  name: "Printy McPrintface",
  uid: 0,
  baudrate: 9600,
  serialport: "/dev/ttyS0",
  ledpin: 12,
});

printer.init();
```

### Server

#### Install

- Install `printerprinter` via npm

```sh
npm i printerprinter
```

- If the `prepare` script is not executed try:

```sh
cd node_modules/printerprinter
npm install && npm run build
```

#### Usage

Initialize the service

```javascript
import { PrinterService } from "printerprinter";

const printerService = new PrinterService({
  port: 3030, // defines the port for the socket service
});

printerService.init();
```

To send something to the printer:

```javascript
printerService
  .print({
    message: {
      text: "foo",
      image: "<base64 encoded image>",
      sender: "bar",
    },
    printerUid: 0,
  })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

### Troubleshooting / Additional Notes

- ...

### Credits

- [Adafruit - Python Thermal Printer](https://github.com/adafruit/Python-Thermal-Printer)
