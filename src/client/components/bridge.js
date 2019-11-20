import path from 'path';
import { PythonShell } from 'python-shell';
import fs from 'fs';
import logger from '../../lib/logger';

const dbPath = path.join(__dirname, '..', 'db.json');
let pyshell;

/**
 * Script for initializing the python print script
 *
 */
function initShell() {
  try {
    const { config } = JSON.parse(fs.readFileSync(dbPath));

    if (!config.baudrate && !config.serialport) {
      logger.info('No valid config found. Try again in 5 seconds');
      setTimeout(() => {
        initShell();
      }, 5000);
    }

    pyshell = new PythonShell(path.normalize(path.join(__dirname, '..', 'python', 'print.py')), {
      pythonPath: '/usr/bin/python',
      args: [
        '--serialport',
        config.serialport || '/dev/ttyS0',
        '--baudrate',
        config.baudrate || 9600
      ]
    });
  } catch (error) {
    logger.error(`could not init python shell, try again in 5 seconds`);
  }
}

initShell();

/**
 * Sends the data to the python script which handles the communication with the printer
 *
 * @param {Object} data
 * @param {string} data.text - message which will be sent to the printer
 * @param {string} data.image - base64 encoded image string
 * @param {string} data.sender - the name of the sender
 */
const sendToPrintScript = data => {
  return new Promise((resolve, reject) => {
    pyshell.send(JSON.stringify(data));

    pyshell.end(function(err, code) {
      if (err)
        reject({
          message: 'Error while executing the python script',
          code,
          err
        });

      resolve({
        message: 'Python script executed successfully',
        code
      });
    });
  });
};

export { sendToPrintScript };
