import BaseController from "./BaseController";
import * as passport from "passport";
import {Admin} from "../db/models/Admin";
import * as jwt from "jsonwebtoken";
import {JwtTokenSecret} from "../config/jwtConfig";
import {adminLoginValidator, createAdminValidator} from "../middlewares/requestValidatiors/adminValidators";
import {NextFunction, Request, Response} from "express";
import {unauthorized} from "@hapi/boom";
import {jwtAuthenticationMiddleware} from "../middlewares/passport/authenticationMiddlewares";
import AdminService from "../services/AdminService";

class AdminController extends BaseController {
    constructor() {
        super(AdminService);
        this.router.post("/login", adminLoginValidator, this.adminLogin);
        this.router.post("/createAdmin", createAdminValidator, jwtAuthenticationMiddleware, this.createAdmin);
    }

    adminLogin(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err || !user) {
                return next(unauthorized("username or password are wrong"))
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
        })(req, res, next);
    }

    async createAdmin(req: Request, res: Response, next: NextFunction) {
        const {userName, password} = req.body;
        const createdAdmin = await this.service.create({userName, password});
        res.json(createdAdmin);
    }

}

let adminRouter = new AdminController().router;
export default adminRouter;

