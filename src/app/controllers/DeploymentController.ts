import BaseCrudController from "./BaseCrudController";
import express, {NextFunction, Request, Response} from "express";
import DeploymentService from "../services/DeploymentService";
import {createDeploymentValidatorHandler} from "../middlewares/requestValidatiors/deploymentValidator";
import errorOnMiddlewareWrapper from "../middlewares/errors/errorOnMiddlewareWrapper";
import {jwtAuthenticationMiddleware} from "../middlewares/passport/authenticationMiddlewares";

export default class DeploymentController extends BaseCrudController {
    constructor() {
        super(DeploymentService);

        this.initStatisticsRoutes();
        this.initDefaults({pagination: {handlers: [jwtAuthenticationMiddleware]}});
        this.router.post("/", createDeploymentValidatorHandler, errorOnMiddlewareWrapper(this.createDeployment));
    }

    createDeployment = async (req: Request, res: Response, next: NextFunction) => {
        let createdDeployment = await this.service.create(req.body);
        res.json(createdDeployment);
    };

    private initStatisticsRoutes() {
        const statisticsRouter = express.Router();
        statisticsRouter.get("/avgPerUser", errorOnMiddlewareWrapper(this.avgPerUser));
        statisticsRouter.get("/avgPerImage", errorOnMiddlewareWrapper(this.avgPerImage));
        statisticsRouter.get("/totalDeployments", errorOnMiddlewareWrapper(this.totalDeployments));
        statisticsRouter.get("/totalDeploymentsPerImage", errorOnMiddlewareWrapper(this.totalDeploymentsPerImage));
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
