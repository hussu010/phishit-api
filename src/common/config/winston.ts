import winston from "winston";
import Sentry from "winston-transport-sentry-node";

const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
  sentry: {
    level: "error",
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
    new Sentry(options.sentry),
  ],
  exitOnError: false,
});

export const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};

export default logger;
