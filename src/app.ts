import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as lusca from "lusca";
import MongoStore from 'connect-mongo';
import * as passport from "passport";
import MongoConnector from "./db/MongoConnector";
import logger from "./logger/logger";
import userRouter from "./controllers/UserController";
import imageRouter from "./controllers/ImageController";
import * as morgan from "morgan";
import deploymentRouter from "./controllers/DeploymentController";

// import homeController from "./controllers/home";
// import userController from "./controllers/user";
// import apiController from "./controllers/api";
// import contactController from "./controllers/contact";

// // API keys and Passport configuration
// import passportConfig from "./config/passport";

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
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// setup the logger
app.use(morgan('tiny'))

app.use("/user", userRouter)
app.use("/image", imageRouter)
app.use("/deployment", deploymentRouter)

// app.use((req, res, next) => {
//     // After successful login, redirect back to the intended page
//     if (!req.user &&
//         req.path !== "/login" &&
//         req.path !== "/signup" &&
//         !req.path.match(/^\/auth/) &&
//         !req.path.match(/\./)) {
//         req.session.returnTo = req.path;
//     } else if (req.user &&
//         req.path == "/account") {
//         req.session.returnTo = req.path;
//     }
//     next();
// });

// /**
//  * Primary app controllers.
//  */
// app.get("/", homeController.index);
// app.get("/login", userController.getLogin);
// app.post("/login", userController.postLogin);
// app.get("/logout", userController.logout);
// app.get("/forgot", userController.getForgot);
// app.post("/forgot", userController.postForgot);
// app.get("/reset/:token", userController.getReset);
// app.post("/reset/:token", userController.postReset);
// app.get("/signup", userController.getSignup);
// app.post("/signup", userController.postSignup);
// app.get("/contact", contactController.getContact);
// app.post("/contact", contactController.postContact);
// app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
// app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
// app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

// /**
//  * API examples controllers.
//  */
// app.get("/api", apiController.getApi);
// app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

// /**
//  * OAuth authentication controllers. (Sign in)
//  */
// app.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email", "public_profile"]}));
// app.get("/auth/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/login"}), (req, res) => {
//     res.redirect(req.session.returnTo || "/");
// });


// app.get("/gal", async (req, res) => {
//
//     try {
//         const createdImage = await ImageModel.create({name: "as"} as User)
//
//         console.log("created!")
//         console.log({
//             id: createdImage.id,
//             id333: typeof createdImage.id,
//             id2: createdImage._id,
//             id2222: typeof createdImage._id,
//         })
//     } catch (err) {
//         console.log("error in creating model")
//         console.log(err)
//     }
//     res.json({a: 2})
//     // .then(x => {
//     //     console.log(`x is created: ${x}`)
//     //     res.json({x})
//     // })
//     // .catch(err => {
//     //     console.log(`error is ${err}`)
//     //     res.json({err})
//     // })
// })
export default app;
