import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
  transports: [new winston.transports.Console()]
});

export default logger;
