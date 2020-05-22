import path from 'path';
import io from 'socket.io-client';
import express from 'express';
import bodyParser from 'body-parser';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { exec } from 'child_process';

import { setBridgeConfig, sendToPrintScript } from './components/bridge';
import gpio from './components/gpio';
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
      uid: props.uid || '0',
      baudrate: props.baudrate || 9600,
      serialport: props.serialport || '/dev/ttyS0',
      ledpin: props.ledpin,
    };

    const adapter = new FileSync(path.join(__dirname, 'db.json'));
    this.db = low(adapter);

    if (this.db.get('config').value() === undefined) {
      this.db
        .defaults({
          config: {
            uid: this.config.uid,
            url: this.config.url,
            serialport: this.config.serialport,
            baudrate: this.config.baudrate,
            name: this.config.name,
            ledpin: this.config.ledpin,
          },
        })
        .write();
    }

    this.config = this.db.get('config').value();
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
      gpio.on();

      socket.emit('register_printer', {
        type: 'printer',
        name: this.config.name,
        uid: this.config.uid,
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Disconnected from ${this.config.url}`);
      gpio.blink(1000);
    });

    socket.on('print_message', async (data, cb) => {
      try {
        gpio.blink(250);

        const res = await sendToPrintScript({
          text: data.text,
          image: data.image,
          sender: data.sender,
        });

        cb({
          from: this.config.uid,
          code: 0,
          message: res.message,
        });
      } catch (error) {
        cb({
          from: this.config.uid,
          code: -1,
          message: error.message,
        });
      }

      gpio.on();
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

    app.get('/restart', (req, res) => {
      const command = `/opt/nodejs/bin/pm2 restart all --update-env`;

      exec(command, (error, stdout, stderr) => {
        if (error)
          return res.status(400).send({ message: 'could not execute command', err: error });

        if (stderr)
          return res.status(400).send({ message: 'error while executeing command', err: stderr });

        res.send({ message: 'restarting printerprinter client' });
      });
    });

    app.get('/test', async (req, res) => {
      try {
        await sendToPrintScript({
          text: 'Hey! I am alive! :)',
          image: '',
          sender: 'myself',
        });

        res.send({ message: 'Printing unit works!' });
      } catch (error) {
        res.status(400).send({ message: 'Could not test printing unit', err: error });
      }
    });

    app.get('/config', (req, res) => {
      const data = this.db.get('config').value();

      res.send(data);
    });

    app.put('/config', (req, res) => {
      // check if config is valid
      if (
        !['url', 'serialport', 'uid', 'baudrate', 'name'].every((item) =>
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
          ledpin: this.config.ledpin,
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
    if (this.config.ledpin) {
      gpio.init({ ledPin: this.config.ledpin });
      gpio.blink(1000);
    }
    setBridgeConfig({ serialport: this.config.serialport, baudrate: this.config.baudrate });
    this.initSocket();
    this.initWeb();
  }
}

export default PrinterClient;
