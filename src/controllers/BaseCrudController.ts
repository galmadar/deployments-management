import * as express from "express";
import {NextFunction, Request, Response, Router} from "express";
import BaseCrudService from "../services/BaseCrudService";
import {validationResultMiddleware} from "./requestValidatiors/BaseValidators";

class BaseCrudController {
    service: BaseCrudService;
    router: Router;

    constructor(service: BaseCrudService) {
        this.service = service;
        this.router = express.Router()
        if (process.env.NODE_ENV !== 'production') {
            this.initDeleteAllRoute()
        }
    }

    protected initFindByIdRoute(handlers: any[] = []) {
        this.router.get("/:id", ...handlers, validationResultMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

    protected initFindAllRoute(handlers: any[] = []) {
        this.router.get("/", ...handlers, validationResultMiddleware, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let allModels = await this.service.findAll();
                    res.json(allModels)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }

    protected initGetAllWithPaginationRoute(handlers: any[] = []) {
        this.router.get("/:pageNumber/:rowsInPage", ...handlers, validationResultMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

    private initDeleteAllRoute(handlers: any[] = []) {
        this.router.delete("/", ...handlers, validationResultMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
