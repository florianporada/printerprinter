import io from 'socket.io-client';
import express from 'express';

// import { sendToPrintScript } from './components/bridge';
import logger from '../lib/logger';

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
    this.webserverPort = props.webserverPort || 8080;
  }

  initSocket() {
    const socket = io.connect(this.url);
    socket.emit('register_printer', {
      type: 'printer',
      name: this.name,
      uid: this.uid
    });

    socket.on('print_message', async (data, cb) => {
      console.log(data);

      try {
        const res = await sendToPrintScript({
          message: data.message,
          sender: data.sender
        });

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

  initWeb() {
    const app = express();

    app.use('/', express.static(`${__dirname}/public`));

    app.get('/config', (req, res) => {
      res.send({});
    });

    app.put('/config', (req, res) => {
      res.send({ message: 'saved config to db' });
    });

    app.listen(this.webserverPort, () => {
      logger.info(`Starting webserver on http://localhost:${this.webserverPort}`);
    });
  }

  init() {
    this.initSocket();
    this.initWeb();
  }
}

export default PrinterClient;
