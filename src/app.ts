import * as express from "express";
import {NextFunction, Request, Response} from "express";
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
import {Error} from "mongoose";
import {Boom} from "@hapi/boom";
import {JwtTokenSecret} from "./config/jwtConfig";
import * as jwt from "jsonwebtoken";

/* Import passport in order to "init" the strategies */
import "./middlewares/passport/passport"
import {Admin} from "./db/models/Admin";

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

app.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        logger.info("auth!!")
        logger.info({user})
        if (err || !user) {
            return res.status(400).json({
                info,
                message: 'Something is not right',
                user: user
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const {_id, userName, password} = user as Admin
            const token = jwt.sign({id: _id, userName, password}, JwtTokenSecret);
            return res.json({user, token});
        });
    })(req, res);
});

app.post("/withAuth", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.send({hello: "world"})
})

app.post("/withoutAuth", (req, res, next) => {
    res.send({hello: "world"})
})

if (process.env.NODE_ENV !== "production") {
    // console.log(listEndpoints(app))
}

let errorHandler = (err: Error | Boom, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Boom && err.isBoom) {
        let output = err.output;
        res.status(output.statusCode).json(output.payload)
    } else {
        res.status(500).json({message: 'server error'});
    }
};

app.use(errorHandler)

export default app;
