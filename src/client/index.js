import path from 'path';
import io from 'socket.io-client';
import express from 'express';
import bodyParser from 'body-parser';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { initBridge, sendToPrintScript } from './components/bridge';
import { initGpio } from './components/gpio';
import logger from '../lib/logger';

/**
 * Client designed for running on an raspberry (or similar)
 *
 * @class PrinterClient
 */
class PrinterClient {
  constructor(props = {}) {
    this.webserverPort = props.webserverPort || 8080;
    this.config = {
      url: props.url || 'http://localhost:3030',
      name: props.name || 'Printy McPrintface',
      uid: props.uid || 0,
      baudrate: props.baudrate || 9600,
      serialport: props.serialport || '/dev/ttyS0',
      ledpin: props.ledpin
    };

    const adapter = new FileSync(path.join(__dirname, 'db.json'));
    this.db = low(adapter);

    if (
      this.db.get('config').value() === undefined ||
      Object.entries(this.db.get('config').value()).length === 0
    ) {
      this.db
        .defaults({
          config: {
            uid: this.config.uid,
            url: this.config.url,
            serialport: this.config.serialport,
            baudrate: this.config.baudrate,
            name: this.config.name,
            ledpin: this.config.ledpin
          }
        })
        .write();

      this.config = this.db.get('config').value();
    }
    if (this.config.ledPin) {
      initGpio({ ledPin: this.config.ledPin });
    }
  }

  /**
   * Starts the socket services which should connect to the server
   *
   * @memberof PrinterClient
   */
  initSocket() {
    const socket = io.connect(this.config.url);

    socket.on('connect', () => {
      logger.info(`Connected to ${this.config.url}`);

      socket.emit('register_printer', {
        type: 'printer',
        name: this.config.name,
        uid: this.config.uid
      });
    });

    socket.on('print_message', async (data, cb) => {
      try {
        const res = await sendToPrintScript({
          text: data.text,
          image: data.image,
          sender: data.sender
        });

        cb({
          from: this.config.uid,
          code: 0,
          message: res.message
        });
      } catch (error) {
        cb({
          from: this.config.uid,
          code: -1,
          message: error.message
        });
      }
    });
  }

  /**
   * Starts the webservice for configuring the printer client via browser
   *
   * @memberof PrinterClient
   */
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
      // check if config is valid
      if (
        !['url', 'serialport', 'uid', 'baudrate', 'name'].every(item =>
          req.body.hasOwnProperty(item)
        )
      ) {
        return res.status(400).send({ message: 'invalid config' });
      }

      const data = this.db.set('config', req.body).write();

      res.send(data.config);
    });

    app.delete('/config', (req, res) => {
      this.db
        .set('config', {
          uid: this.config.uid,
          url: this.config.url,
          serialport: this.config.serialport,
          baudrate: this.config.baudrate,
          name: this.config.name,
          ledpin: this.config.ledpin
        })
        .write();

      res.send({ message: 'reset config in db' });
    });

    app.listen(this.webserverPort, () => {
      logger.info(`Starting webserver on http://localhost:${this.webserverPort}`);
    });
  }

  /**
   * Initialize all client services
   *
   * @memberof PrinterClient
   */
  init() {
    initBridge({ serialport: this.config.serialport, baudrate: this.config.baudrate });
    this.initSocket();
    this.initWeb();
  }
}

export default PrinterClient;
