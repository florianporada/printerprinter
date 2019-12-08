import { Gpio } from 'onoff';
import logger from '../../lib/logger';

let led;
let interval;

function init({ ledPin }) {
  logger.info('init gpio');
  led = new Gpio(ledPin, 'out');
}

function on() {
  if (interval) clearInterval(interval);

  if (led) led.writeSync(1);
}

function off() {
  if (interval) clearInterval(interval);

  if (led) led.writeSync(0);
}

function blink(frequency = 200) {
  if (interval) clearInterval(interval);

  if (led) {
    interval = setInterval(() => led.writeSync(led.readSync() ^ 1), frequency);
  }
}

process.on('SIGINT', () => {
  if (led) led.unexport();
  if (interval) clearInterval(interval);
});

export default { init, on, off, blink };
