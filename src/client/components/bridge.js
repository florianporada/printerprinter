import path from 'path';
import { PythonShell } from 'python-shell';

const pyshell = new PythonShell(path.normalize(path.join(__dirname, '..', 'python', 'print.py')));

/**
 *
 *
 * @param {Object} data
 * @param {string} data.message - message which will be sent to the printer
 * @param {string} data.image - base64 encoded image string
 * @param {string} data.from - the name of the sender
 */
const sendToPrintScript = data => {
  return new Promise((resolve, reject) => {
    pyshell.send(data);

    pyshell.end(function(err, code, signal) {
      if (err)
        reject({
          message: 'Error while executing the python script',
          err
        });

      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');

      resolve({
        message: 'Python script executed successfully',
        code
      });
    });
  });
};

export { sendToPrintScript };
