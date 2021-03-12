import {Mongoose} from "mongoose";
import * as mongoose from "mongoose";
import * as bluebird from "bluebird";
import logger from "../utils/Logger";

export default class MongoConnector {
    connect(mongoUrl: string) {
        logger.info(`connecting to mongo with url ${mongoUrl}`);
        (mongoose as Mongoose).Promise = bluebird;
        return mongoose.connect(mongoUrl, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    }

}
