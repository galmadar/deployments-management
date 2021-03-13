import mongoose from "mongoose";
import {Mongoose} from "mongoose";
import bluebird from "bluebird";
import logger from "../utils/Logger";
import dbConfig from "../config/dbConfig";

class MongoConnector {
    mongoUrl = dbConfig.getMongoUrl();

    connect(connectionString: string = this.mongoUrl) {
        logger.info(`connecting to mongo with url ${connectionString}`);
        (mongoose as Mongoose).Promise = bluebird;
        return mongoose
            .connect(connectionString, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
            .then((mongo) => {
                logger.debug(`connected to mongo with URL: ${connectionString}`);
            });
    }
}

export default new MongoConnector();
