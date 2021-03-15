import express, {Express} from "express";
import bodyParser from "body-parser";
import passport from "passport";
import morgan from "morgan";
import mongoConnector from "./app/db/MongoConnector";
import logger from "./utils/Logger";
import UserController from "./app/controllers/UserController";
import ImageController from "./app/controllers/ImageController";
import DeploymentController from "./app/controllers/DeploymentController";
import AdminController from "./app/controllers/AdminController";
import {errorHandlerMiddleware} from "./app/middlewares/errors/errorHandlerMiddleware";
import {initDB} from "./app/db/initDB";
import "./app/middlewares/passport/passport"; /* Import this in order to "init" passport's strategies */

class App {
    public express: Express;

    constructor() {
        this.express = express();
    }

    listen(port: number): Promise<void> {
        return new Promise((res, rej) => {
            this.express.listen(port, res);
        });
    }

    async init(options: {mongoURL: string}) {
        // Express configuration
        this.express.use(bodyParser.json());

        /* Setup passport for [Admin] Authentication */
        this.express.use(passport.initialize());

        /* Setup request logger */
        this.express.use(morgan("tiny"));

        /* Setup routes */
        this.express.use("/user", new UserController().router);
        this.express.use("/image", new ImageController().router);
        this.express.use("/deployment", new DeploymentController().router);
        this.express.use("/admin", new AdminController().router);

        /* Setup error handling middleware */
        this.express.use(errorHandlerMiddleware);

        /* Connect to DB */
        await this.connectToDB(options.mongoURL);
    }

    async connectToDB(mongoURL: string) {
        try {
            /* Connect to MongoDB */
            await mongoConnector.connect(mongoURL);

            /* Script for creating the first Admin user */
            await initDB();
        } catch (err) {
            logger.error("MongoDB connection error. Please make sure MongoDB is running.", err);
        }
    }
}

export default App;
