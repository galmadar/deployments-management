import * as express from "express";
import {NextFunction, Request, Response, Router} from "express";
import BaseCrudService from "../services/BaseCrudService";
import logger from "../logger/logger";

class BaseCrudController {
    protected service: BaseCrudService;
    router: Router;

    constructor(service: BaseCrudService) {
        this.service = service;
        this.router = express.Router()
        if (process.env.NODE_ENV !== 'production') {
            this.initDeleteAllRoute()
        }
    }

    protected initFindByIdRoute() {
        this.router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params
                let foundModel
                try {
                    foundModel = await this.service.findById(id)
                    res.json(foundModel)
                } catch (err) {
                    res.status(204)
                }
            }
        )
    }

    protected initFindAllRoute() {
        this.router.get("/", async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let allModels = await this.service.findAll();
                    res.json(allModels)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }

    private initDeleteAllRoute() {
        this.router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let deletedAll = await this.service.deleteAll();
                    res.json(deletedAll)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }
}


export default BaseCrudController;
