import UserService from "../services/UserService";
import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import {createUserRequestValidator} from "../middlewares/requestValidatiors/userValidators";
import asyncErrorWrapper from "../middlewares/errors/asyncErrorWrapper";

export default class UserController extends BaseCrudController {
    constructor() {
        super(UserService);

        this.initDefaults({withFindById: true});
        this.router.post("/", createUserRequestValidator, asyncErrorWrapper(this.createOrUpdate));
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

        res.json(createdOrUpdatedModel);
    };
}
