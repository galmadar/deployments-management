import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import morgan from "morgan";
import mongoConnector from "./db/MongoConnector";
import logger from "./utils/Logger";
import userRouter from "./controllers/UserController";
import imageRouter from "./controllers/ImageController";
import deploymentRouter from "./controllers/DeploymentController";
import adminRouter from "./controllers/AdminController";
import {errorHandlerMiddleware} from "./middlewares/errors/errorHandlerMiddleware";
import {initDB} from "./db/initDB";

/* Import passport in order to "init" the strategies */
import "./middlewares/passport/passport";

// Create Express server
const app = express();

// Connect to MongoDB
mongoConnector
    .connect()
    .then(() => {
        /* Script for creating the first Admin user */
        initDB();
    })
    .catch((err) => {
        logger.error("MongoDB connection error. Please make sure MongoDB is running.", err);
    });

// Express configuration
app.use(bodyParser.json());

/* Setup passport for [Admin] Authentication */
app.use(passport.initialize());

/* Setup request logger */
app.use(morgan("tiny"));

/* Setup routes */
app.use("/user", userRouter);
app.use("/image", imageRouter);
app.use("/deployment", deploymentRouter);
app.use("/admin", adminRouter);

/* Setup error handling middleware */
app.use(errorHandlerMiddleware);

export default app;
