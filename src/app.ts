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

/* Import passport in order to "init" the strategies */
import "./app/middlewares/passport/passport";

class App {
    public app: Express;

    constructor() {
        this.app = express();
    }

    listen(port: number): Promise<void> {
        return new Promise((res, rej) => {
            this.app.listen(port, res);
        });
    }

    async config(mongoURL: string) {
        // Express configuration
        this.app.use(bodyParser.json());

        /* Setup passport for [Admin] Authentication */
        this.app.use(passport.initialize());

        /* Setup request logger */
        this.app.use(morgan("tiny"));

        /* Setup routes */
        this.app.use("/user", new UserController().router);
        this.app.use("/image", new ImageController().router);
        this.app.use("/deployment", new DeploymentController().router);
        this.app.use("/admin", new AdminController().router);

        /* Setup error handling middleware */
        this.app.use(errorHandlerMiddleware);

        /* Connect to DB */
        await this.connectToDB(mongoURL);
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
