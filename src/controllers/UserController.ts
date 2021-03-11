import UserService from "../services/UserService";
import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import {createUserValidatorHandler} from "./requestValidatiors/UserValidators";

class UserController extends BaseCrudController {
    constructor() {
        super(UserService);

        this.initDefaults({withFindById: true});
        this.initCreateOrUpdateRoute();
    }

    protected initCreateOrUpdateRoute() {
        this.router.post("/",
            createUserValidatorHandler,
            async (req: Request, res: Response, next: NextFunction) => {
                let createdOrUpdatedModel: any;
                try {
                    const {_id: id} = req.body;
                    if (id) {
                        const model = {...req.body};
                        delete model._id;
                        createdOrUpdatedModel = await this.service.updateById(id, model);
                    } else {
                        createdOrUpdatedModel = await this.service.create(req.body);
                    }

                    res.json(createdOrUpdatedModel)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }
}

let userRouter = new UserController().router;
export default userRouter;

