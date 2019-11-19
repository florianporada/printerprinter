import path from 'path';
import { PythonShell } from 'python-shell';

const pyshell = new PythonShell(path.normalize(path.join(__dirname, '..', 'python', 'print.py')), {
  pythonPath: '/usr/bin/python'
});

/**
 * Sends the data to the python script which handles the communication with the printer
 *
 * @param {Object} data
 * @param {string} data.message - message which will be sent to the printer
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
