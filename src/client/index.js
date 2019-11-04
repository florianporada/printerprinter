import io from 'socket.io-client';

import { sendToPrintScript } from './components/bridge';

/**
 *
 *
 * @class PrinterClient
 */
class PrinterClient {
  constructor(props = {}) {
    this.url = props.url || 'http://localhost:3030';
    this.name = props.name || 'Printy McPrintface';
    this.uid = props.uid || 0;
  }

  init() {
    const socket = io.connect(this.url);
    socket.emit('register_printer', { type: 'printer', name: this.name, uid: this.uid });

    socket.on('print_message', async (data, cb) => {
      try {
        const res = await sendToPrintScript({ message: data.message, from: data.sender });

        cb({
          from: this.uid,
          code: 0,
          message: res.message
        });
      } catch (error) {
        cb({
          from: this.uid,
          code: -1,
          message: error.message
        });
      }
    });
  }
}

export default PrinterClient;
