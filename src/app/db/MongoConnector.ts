import mongoose, {Mongoose} from "mongoose";
import bluebird from "bluebird";
import logger from "../../utils/Logger";
import config from "../../config/config";

class MongoConnector {
    async connect(connectionString: string = config.mongoUrl) {
        logger.info(`connecting to mongo with URL: ${connectionString}.....`);
        (mongoose as Mongoose).Promise = bluebird;
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        logger.debug(`CONNECTED to mongo with URL: ${connectionString}!`);
    }
}

export default new MongoConnector();
