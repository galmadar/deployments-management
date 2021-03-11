import UserService from "../services/UserService";
import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";

class UserController extends BaseCrudController {
    constructor() {
        super(UserService);
        this.initFindByIdRoute();
        this.initCreateOrUpdateRoute();
        if (process.env.NODE_ENV !== "production") {
            this.initFindAllRoute()
        }
    }

    protected initCreateOrUpdateRoute() {
        this.router.post("/", async (req: Request, res: Response, next: NextFunction) => {
                let createdOrUpdatedModel: any;
                try {
                    const {_id: id} = req.body;
                    if (id) {
                        const model = {...req.body}
                        delete model.id
                        createdOrUpdatedModel = await this.service.updateById(id, model)
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

