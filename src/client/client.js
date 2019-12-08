import PrinterClient from './index';
import dotenv from 'dotenv';
import logger from '../lib/logger';

// load .env file
dotenv.config();

let printer;

if (process.env.PRINTER_CONFIG_MODE === 'env') {
  logger.info('using config from .env file');

  printer = new PrinterClient({
    url: process.env.PRINTER_SOCKET_URL,
    webserverPort: process.env.PRINTER_WEBSERVER_PORT,
    name: process.env.PRINTER_NAME,
    uid: process.env.PRINTER_UID,
    baudrate: process.env.PRINTER_BAUDRATE,
    serialport: process.env.PRINTER_SERIALPORT,
    ledpin: process.env.PRINTER_LED
  });
} else {
  logger.info('using config from db');

  printer = new PrinterClient();
}

printer.init();
