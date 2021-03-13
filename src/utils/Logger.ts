import * as winston from "winston";

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({level: "debug"}),
        new winston.transports.File({filename: "logger.log", level: "debug"}),
    ],
};

const logger = winston.createLogger(options);

export default logger;
