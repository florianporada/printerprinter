import { Gpio } from 'onoff';
import logger from '../../lib/logger';

let led;
let interval;

function initGpio({ ledPin }) {
  logger.info('init gpio');
  led = new Gpio(ledPin, 'out');
}
function on() {
  if (interval) clearInterval(interval);

  led.writeSync(1);
}
function off() {
  if (interval) clearInterval(interval);

  led.writeSync(0);
}
function blink(frequency) {
  if (interval) clearInterval(interval);

  interval = setInterval(() => led.writeSync(led.readSync() ^ 1), frequency);
}

process.on('SIGINT', () => {
  led.unexport();
  clearInterval(interval);
});

export { initGpio, on, off, blink };
