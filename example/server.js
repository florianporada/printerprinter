import { PrinterService } from '../src/index';

const printerService = new PrinterService();

printerService.init();

setTimeout(() => {
  printerService
    .print({ message: { text: 'foo', sender: 'bar' } })
    .then(res => console.log(res))
    .catch(err => console.log(err));
}, 5000);
