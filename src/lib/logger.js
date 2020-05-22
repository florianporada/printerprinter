import winston from 'winston';

const custom = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
    custom
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
