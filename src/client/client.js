import PrinterClient from './index';
import dotenv from 'dotenv';

// load .env file
dotenv.config();

const printer = new PrinterClient({
  url: process.env.PRINTER_SOCKET_URL,
  webserverPort: process.env.PRINTER_WEBSERVER_PORT,
  name: process.env.PRINTER_NAME,
  uid: process.env.PRINTER_UID,
  baudrate: process.env.PRINTER_BAUDRATE,
  serialport: printer.env.PRINTER_SERIALPORT,
  ledpin: process.env.PRINTER_LED
});

printer.init();
