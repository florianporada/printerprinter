import PrinterClient from '../src/client/index';

const printer = new PrinterClient({
  url: 'http://192.168.178.20:3030'
});

printer.init();
