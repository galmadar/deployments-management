import BaseCrudController from "./BaseCrudController";
import express from "express";
import {NextFunction, Request, Response} from "express";
import DeploymentService from "../services/DeploymentService";
import {createDeploymentValidatorHandler} from "../middlewares/requestValidatiors/deploymentValidator";
import asyncMiddleware from "../middlewares/async/async.middleware";
import {jwtAuthenticationMiddleware} from "../middlewares/passport/authenticationMiddlewares";

class DeploymentController extends BaseCrudController {
    constructor() {
        super(DeploymentService);

        this.initStatisticsRoutes();
        this.initDefaults({
            withPagination: {handlers: [jwtAuthenticationMiddleware]},
        });
        this.router.post("/", createDeploymentValidatorHandler, asyncMiddleware(this.createDeployment));
    }

    createDeployment = async (req: Request, res: Response, next: NextFunction) => {
        let createdDeployment = await this.service.create(req.body);
        res.json(createdDeployment);
    };

    private initStatisticsRoutes() {
        const statisticsRouter = express.Router();
        statisticsRouter.get("/avgPerUser", asyncMiddleware(this.avgPerUser));
        statisticsRouter.get("/avgPerImage", asyncMiddleware(this.avgPerImage));
        statisticsRouter.get("/totalDeployments", asyncMiddleware(this.totalDeployments));
        statisticsRouter.get("/totalDeploymentsPerImage", asyncMiddleware(this.totalDeploymentsPerImage));
        this.router.use("/statistics", jwtAuthenticationMiddleware, statisticsRouter);
    }

    private avgPerUser = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = this.service as typeof DeploymentService;
        const result = await deploymentService.avgPerUser();
        res.json(result);
    };

    private avgPerImage = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = this.service as typeof DeploymentService;
        const result = await deploymentService.avgPerImage();
        res.json(result);
    };

    private totalDeployments = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = this.service as typeof DeploymentService;
        const result = await deploymentService.totalDeployments();
        res.json(result);
    };

    private totalDeploymentsPerImage = async (req: Request, res: Response, next: NextFunction) => {
        const deploymentService = this.service as typeof DeploymentService;
        const result = await deploymentService.totalDeploymentsPerImage();
        res.json(result);
    };
}

let deploymentRouter = new DeploymentController().router;
export default deploymentRouter;
