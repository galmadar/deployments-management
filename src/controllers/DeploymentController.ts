import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import DeploymentService from "../services/DeploymentService";
import {createDeploymentValidatorHandler} from "../middlewares/requestValidatiors/deploymentValidator";
import asyncMiddleware from "../middlewares/async.middleware";

class DeploymentController extends BaseCrudController {
    constructor() {
        super(DeploymentService);

        this.initStatisticsRoutes();
        this.initDefaults({withPagination: true});
        this.router.post("/", createDeploymentValidatorHandler, asyncMiddleware(this.createDeployment))
    }

    createDeployment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let createdDeployment = await this.service.create(req.body);
            res.json(createdDeployment)
        } catch (err) {
            res.status(500)
        }
    }

    private initStatisticsRoutes() {
        this.router.get("/statistics/avgPerUser", asyncMiddleware(this.avgPerUser));
        this.router.get("/statistics/avgPerImage", asyncMiddleware(this.avgPerImage));
        this.router.get("/statistics/totalDeployments", asyncMiddleware(this.totalDeployments));
        this.router.get("/statistics/totalDeploymentsPerImage", asyncMiddleware(this.totalDeploymentsPerImage));
    }

    private avgPerUser = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = (this.service as typeof DeploymentService);
        const result = await deploymentService.avgPerUser();
        res.json(result)
    }

    private avgPerImage = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = (this.service as typeof DeploymentService);
        const result = await deploymentService.avgPerImage();
        res.json(result)
    }

    private totalDeployments = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = (this.service as typeof DeploymentService);
        const result = await deploymentService.totalDeployments();
        res.json(result)
    }

    private totalDeploymentsPerImage = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = (this.service as typeof DeploymentService);
        const result = await deploymentService.totalDeploymentsPerImage();
        res.json(result)
    }
}

let deploymentRouter = new DeploymentController().router;
export default deploymentRouter;

