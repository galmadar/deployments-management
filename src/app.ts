import * as express from "express";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import MongoConnector from "./db/MongoConnector";
import logger from "./utils/Logger";
import userRouter from "./controllers/UserController";
import imageRouter from "./controllers/ImageController";
import * as morgan from "morgan";
import deploymentRouter from "./controllers/DeploymentController";
import adminRouter from "./controllers/AdminController";
import {errorHandlerMiddleware} from "./middlewares/errors/errorHandlerMiddleware";
import {AdminModel} from "./db/models/Admin";
import {initAdminProps} from "./config/adminConfig";

/* Import passport in order to "init" the strategies */
import "./middlewares/passport/passport"

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/enso";
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

if (process.env.NODE_ENV !== "production") {
    // console.log(listEndpoints(app))
}

const initAdmin = async () => {
    const {userName, password} = initAdminProps;
    let initializedAdmin = await AdminModel.findOne({userName, password});
    if (!initializedAdmin) {
        initializedAdmin = await AdminModel.create({userName, password});
    }

    return initializedAdmin
}

initAdmin()
    .then(admin => {
        logger.debug("Created admin:")
        logger.debug(admin)
    })
    .catch(err => {
        logger.error("Error on creating first admin", err)
    })

export default app;
