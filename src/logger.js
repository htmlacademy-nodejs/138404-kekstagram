'use strict';

const winston = require(`winston`);

const {
  createLogger,
  format,
  transports
} = winston;

const {
  combine,
  timestamp
} = format;

const {
  SERVER_LOG_LEVEL = `info`
} = process.env;

const logger = createLogger({
  level: `${SERVER_LOG_LEVEL}`,
  format: format.json(),
  transports: [
    new transports.File({
      filename: `error.log`,
      level: `error`
    }),
    new transports.File({
      filename: `combined.log`
    })
  ]
});

if (process.env.NODE_ENV !== `production`) {
  logger.add(
      new transports.Console({
        level: `silly`,
        format: combine(timestamp(), format.simple())
      })
  );
}

module.exports = logger;
