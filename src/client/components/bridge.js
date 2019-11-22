import path from 'path';
import { PythonShell } from 'python-shell';
import logger from '../../lib/logger';

let pyshell;

/**
 * Script for initializing the python print script
 *
 * @param {Object} config
 * @param {string} config.serialport - serial port where the printer is attached to
 * @param {number} config.baudrate - baudrate for communicating with the serial device
 */
function initBridge(config) {
  try {
    pyshell = new PythonShell(path.normalize(path.join(__dirname, '..', 'python', 'print.py')), {
      pythonPath: config.pythonPath || '/usr/bin/python',
      args: [
        '--serialport',
        config.serialport || '/dev/ttyS0',
        '--baudrate',
        config.baudrate || 9600
      ]
    });
  } catch (error) {
    logger.error(`could not init python shell`, error);
  }
}

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
    if (!pyshell) reject({ message: 'Pyshell not initialized', code: -1 });

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

export { initBridge, sendToPrintScript };
