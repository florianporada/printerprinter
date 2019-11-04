import io from 'socket.io-client';

/**
 *
 *
 * @class PrinterClient
 */
class PrinterClient {
  constructor(props) {
    this.url = props.url || 'http://localhost:3030';
    this.name = props.name || 'Printy McPrintface';
    this.uid = props.uid || 0;
  }

  init() {
    const socket = io.connect(this.url);
    socket.emit('register_printer', { type: 'printer', name: this.name, uid: this.uid });
    socket.on('print_message', (data, cb) => {
      console.log('message', data);
      cb('printed');
    });
  }
}

export default PrinterClient;
