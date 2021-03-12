import UserService from "../services/UserService";
import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import {createUserValidatorHandler} from "../middlewares/requestValidatiors/userValidators";
import asyncMiddleware from "../middlewares/async.middleware";

class UserController extends BaseCrudController {
    constructor() {
        super(UserService);

        this.initDefaults({withFindById: true});
        this.router.post("/", createUserValidatorHandler, asyncMiddleware(this.createOrUpdate));
    }

    createOrUpdate = async (req: Request, res: Response, next: NextFunction) => {
        let createdOrUpdatedModel: any;
        const {_id: id} = req.body;
        if (id) {
            const model = {...req.body};
            delete model._id;
            createdOrUpdatedModel = await this.service.updateById(id, model);
        } else {
            createdOrUpdatedModel = await this.service.create(req.body);
        }

        res.json(createdOrUpdatedModel)
    };

}

let userRouter = new UserController().router;
export default userRouter;

