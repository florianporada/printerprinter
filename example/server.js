import PrinterService from '../src/server/index';

const printerService = new PrinterService();

printerService.init();

setTimeout(() => {
  printerService
    .print({ message: { text: 'foo', sender: 'bar' }, printerUid: '0' })
    .then(res => console.log(res))
    .catch(err => console.log(err));
}, 40000);
