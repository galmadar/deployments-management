import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import DeploymentService from "../services/DeploymentService";

class DeploymentController extends BaseCrudController {
    constructor() {
        super(DeploymentService);
        this.initFindByIdRoute();
        this.initFindAllRoute();
        this.initGetAllWithPaginationRoute();
        this.initCreateDeploymentRoute()
    }

    protected initCreateDeploymentRoute() {
        this.router.post("/", async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let createdDeployment = await this.service.create(req.body);
                    res.json(createdDeployment)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }

}

let deploymentRouter = new DeploymentController().router;
export default deploymentRouter;

