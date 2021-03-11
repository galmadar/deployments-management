import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import MongoStore from 'connect-mongo';
import * as passport from "passport";
import MongoConnector from "./db/MongoConnector";
import logger from "./logger/logger";
import userRouter from "./controllers/UserController";
import imageRouter from "./controllers/ImageController";
import * as morgan from "morgan";
import deploymentRouter from "./controllers/DeploymentController";
import * as listEndpoints from "express-list-endpoints";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = "mongodb://localhost:27017/enso";
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
// app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "SESSION_SECRET",
    store: MongoStore.create({
        mongoUrl: mongoUrl
    })
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(lusca.xframe("SAMEORIGIN"));
// app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// });

// setup the logger
app.use(morgan('tiny'))

app.use("/user", userRouter)
app.use("/image", imageRouter)
app.use("/deployment", deploymentRouter)

if (process.env.NODE_ENV !== "production") {
    console.log(listEndpoints(app))
}

export default app;
