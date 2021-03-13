import * as express from "express";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as listEndpoints from "express-list-endpoints";
import * as morgan from "morgan";
import MongoConnector from "./db/MongoConnector";
import logger from "./utils/Logger";
import userRouter from "./controllers/UserController";
import imageRouter from "./controllers/ImageController";
import deploymentRouter from "./controllers/DeploymentController";
import adminRouter from "./controllers/AdminController";
import {errorHandlerMiddleware} from "./middlewares/errors/errorHandlerMiddleware";
import {initAdmin} from "./db/initDB";

/* Import passport in order to "init" the strategies */
import "./middlewares/passport/passport"

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/deployments";
let mongoConnector = new MongoConnector();
mongoConnector.connect(mongoUrl)
    .then((res) => {
        logger.info("connected to mongo");
    },)
    .catch(err => {
        logger.error("MongoDB connection error. Please make sure MongoDB is running.", err);
    });

// Express configuration
app.use(bodyParser.json());

/* Setup passport for [Admin] Authentication */
app.use(passport.initialize());

/* Setup request logger */
app.use(morgan('tiny'))

/* Setup routes */
app.use("/user", userRouter);
app.use("/image", imageRouter);
app.use("/deployment", deploymentRouter);
app.use("/admin", adminRouter);

/* Setup error handling middleware */
app.use(errorHandlerMiddleware)

/* List all endpoints (for debug purposes) */
if (process.env.NODE_ENV !== "production") {
    console.log(listEndpoints(app))
}

/* Script for creating the first Admin user */
initAdmin()

export default app;
