import { PrinterService } from '../src/index';

const printerService = new PrinterService();

printerService.init();

setTimeout(() => {
  printerService.print({ message: 'heeooo' });
}, 5000);
