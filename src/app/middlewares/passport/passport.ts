import passport from "passport";
import passportLocal from "passport-local";
import {AdminModel} from "../../db/models/Admin";
import passportJWT from "passport-jwt";
import logger from "../../../utils/Logger";
import config from "../../../config/config";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: "userName",
            passwordField: "password",
        },
        async function (userName, password, cb) {
            try {
                //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
                const admin = await AdminModel.findOne({userName, password});
                if (!admin) {
                    logger.debug("not found!!");
                    return cb(null, null, {
                        message: "Incorrect email or password.",
                    });
                }
                return cb(null, admin, {
                    message: "Logged In Successfully",
                });
            } catch (err) {
                logger.error("Error in adminModel", err);
                cb(err);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtTokenSecret,
        },
        async function (jwtPayload, cb) {
            try {
                //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
                const admin = await AdminModel.findById(jwtPayload.id);
                return cb(null, admin);
            } catch (err) {
                return cb(err);
            }
        }
    )
);
