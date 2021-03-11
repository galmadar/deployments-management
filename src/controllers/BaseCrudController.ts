import * as express from "express";
import {NextFunction, Request, Response, Router} from "express";
import BaseCrudService from "../services/BaseCrudService";
import {validationPaginationMiddleware, validationResultMiddleware} from "./requestValidatiors/BaseValidators";

class BaseCrudController {
    service: BaseCrudService;
    router: Router;

    constructor(service: BaseCrudService) {
        this.service = service;
        this.router = express.Router()
    }

    protected initDefaults(options?: { withPagination?: boolean, withFindById?: boolean }) {
        if (options?.withPagination) {
            this.initGetAllWithPaginationRoute();
        }
        if (options?.withFindById) {
            this.initFindByIdRoute();
        }
        if (process.env.NODE_ENV !== 'production') {
            this.initFindAllRoute();
            this.initDeleteAllRoute()
        }
    }

    protected initFindByIdRoute() {
        this.router.get("/:id", validationResultMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
        this.router.get("/", validationResultMiddleware, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let allModels = await this.service.findAll();
                    res.json(allModels)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }

    protected initGetAllWithPaginationRoute() {
        this.router.get("/:pageNumber/:rowsInPage",
            validationPaginationMiddleware,
            validationResultMiddleware,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const {rowsInPage, pageNumber} = req.params;
                    const nRowsInPage = Number.parseInt(rowsInPage)
                    const nPageNumber = Number.parseInt(pageNumber)
                    let pagination = await this.service.getAllWithPagination(nRowsInPage, nPageNumber);
                    res.json(pagination)
                } catch (err) {
                    res.send("Error in getting initGetAllWithPaginationRoute")
                }
            }
        )
    }

    private initDeleteAllRoute() {
        this.router.delete("/", validationResultMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
