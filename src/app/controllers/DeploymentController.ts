import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import DeploymentService from "../services/DeploymentService";
import {
    createDeploymentRequestValidator,
    getStatisticsRequestValidator,
} from "../middlewares/requestValidatiors/deploymentValidator";
import asyncErrorWrapper from "../middlewares/errors/asyncErrorWrapper";
import {jwtAuthenticationMiddleware} from "../middlewares/passport/authenticationMiddlewares";

export default class DeploymentController extends BaseCrudController {
    constructor() {
        super(DeploymentService);

        this.router.use(
            "/statistics",
            getStatisticsRequestValidator("avgPerUser", "avgPerImage", "totalDeployments", "totalDeploymentsPerImage"),
            jwtAuthenticationMiddleware,
            asyncErrorWrapper(this.getStatistics)
        );
        this.initDefaults({pagination: {handlers: [jwtAuthenticationMiddleware]}});
        this.router.post("/", createDeploymentRequestValidator, asyncErrorWrapper(this.createDeployment));
    }

    createDeployment = async (req: Request, res: Response, next: NextFunction) => {
        let createdDeployment = await this.service.create(req.body);
        res.json(createdDeployment);
    };

    private getStatistics = async (req: Request, res: Response, next: NextFunction) => {
        const {action} = req.body;
        let result;
        const deploymentService = this.service as typeof DeploymentService;
        switch (action) {
            case "avgPerUser":
                result = await deploymentService.avgPerUser();
                break;
            case "avgPerImage":
                result = await deploymentService.avgPerImage();
                break;
            case "totalDeployments":
                result = await deploymentService.totalDeployments();
                break;
            case "totalDeploymentsPerImage":
                result = await deploymentService.totalDeploymentsPerImage();
                break;
        }

        return res.json(result);
    };
}
