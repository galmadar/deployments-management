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
        this.initStatisticsRoutes();
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

    private initStatisticsRoutes() {
        this.router.use("/statistics/avgPerUser", this.avgPerUser)
        this.router.use("/statistics/avgPerImage", this.avgPerImage)
        this.router.use("/statistics/totalDeployments", this.totalDeployments)
        this.router.use("/statistics/totalDeploymentsPerImage", this.totalDeploymentsPerImage)
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

