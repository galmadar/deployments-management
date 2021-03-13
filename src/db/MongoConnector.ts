import * as mongoose from "mongoose";
import {Mongoose} from "mongoose";
import * as bluebird from "bluebird";
import logger from "../utils/Logger";

class MongoConnector {
    mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/deployments";

    connect() {
        logger.info(`connecting to mongo with url ${this.mongoUrl}`);
        (mongoose as Mongoose).Promise = bluebird;
        return mongoose
            .connect(this.mongoUrl, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
            .then((mongo) => {
                logger.debug(`connected to mongo with URL: ${this.mongoUrl}`);
            });
    }
}

export default new MongoConnector();
