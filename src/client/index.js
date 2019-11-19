import path from 'path';
import io from 'socket.io-client';
import express from 'express';
import bodyParser from 'body-parser';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

// import { sendToPrintScript } from './components/bridge';
import logger from '../lib/logger';

/**
 *
 *
 * @class PrinterClient
 */
class PrinterClient {
  constructor(props = {}) {
    this.webserverPort = props.webserverPort || 8080;
    this.url = props.url || 'http://localhost:3030';
    this.name = props.name || 'Printy McPrintface';
    this.uid = props.uid || 0;
    this.baudrate = props.webserverPort || 9600;
    this.serialport = props.webserverPort || '/dev/ttyS0';

    const adapter = new FileSync(path.join(__dirname, 'db.json'));
    this.db = low(adapter);
    this.db
      .defaults({
        config: {
          uid: this.uid,
          url: this.url,
          serialport: this.serialport,
          baudrate: this.baudrate,
          name: this.name
        }
      })
      .write();
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
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/', express.static(`${__dirname}/public`));

    app.get('/config', (req, res) => {
      const data = this.db.get('config').value();

      res.send(data);
    });

    app.put('/config', (req, res) => {
      this.db.set('config', req.body).write();

      res.send({ message: 'saved config to db' });
    });

    app.delete('/config', (req, res) => {
      this.db
        .set('config', {
          uid: this.uid,
          url: this.url,
          serialport: this.serialport,
          baudrate: this.baudrate,
          name: this.name
        })
        .write();

      res.send({ message: 'reset config in db' });
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
