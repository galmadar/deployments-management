import * as winston from "winston";

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({level: 'debug'}),
        new winston.transports.File({filename: "logger.log", level: "debug"})
    ]
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;
