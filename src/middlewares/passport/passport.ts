import * as passport from "passport";
import * as passportLocal from "passport-local";
import {Admin, AdminModel} from "../../db/models/Admin";
import * as passportJWT from "passport-jwt";
import {JwtTokenSecret} from "../../config/jwtConfig";
import logger from "../../logger/logger";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.serializeUser<any, any>((req, user, done) => {
    logger.info("in serializeUser")
    logger.info("in serializeUser")
    done(undefined, user);
});

passport.deserializeUser(async (id, done) => {
    logger.info("in deeeeeserializeUser")
    const admin = await AdminModel.findById(id).catch(done);
    done(null, (admin as Admin)._id)
});

passport.use(new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password'
    },
    function (userName, password, cb) {
        logger.info("in localstrategy!!!")
        logger.info("in localstrategy!!!")
        logger.info("in localstrategy!!!")
        logger.info("in localstrategy!!!")
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return AdminModel.findOne({userName, password})
            .then(admin => {
                if (!admin) {
                    logger.debug("not found!!")
                    return cb(null, null, {message: 'Incorrect email or password.'});
                }
                return cb(null, admin, {message: 'Logged In Successfully'});
            })
            .catch(err => {
                logger.error("Error in adminModel", err)
                cb(err)
            });
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JwtTokenSecret
    },
    function (jwtPayload, cb) {
        logger.info("in JWTTTT!!!");
        logger.info("in JWTTTT!!!");
        logger.info("in JWTTTT!!!");
        logger.info("in JWTTTT!!!");
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return AdminModel.findById(jwtPayload.id)
            .then(admin => {
                return cb(null, admin);
            })
            .catch(err => {
                return cb(err);
            });
    }
));
