import * as express from "express";
import {NextFunction, Request, Response, Router} from "express";
import BaseCrudService from "../services/BaseCrudService";
import {validationPaginationMiddleware, validationResultMiddleware} from "../middlewares/requestValidatiors/baseValidators";
import asyncMiddleware from "../middlewares/async.middleware";

class BaseCrudController {
    service: BaseCrudService;
    router: Router;

    constructor(service: BaseCrudService) {
        this.service = service;
        this.router = express.Router()
    }

    protected initDefaults(options?: { withPagination?: boolean, withFindById?: boolean }) {
        if (options?.withPagination) {
            this.router.get("/:pageNumber/:rowsInPage", validationPaginationMiddleware, validationResultMiddleware, asyncMiddleware(this.getAllWithPagination));
        }
        if (options?.withFindById) {
            this.router.get("/:id", validationResultMiddleware, asyncMiddleware(this.findById))
        }
        if (process.env.NODE_ENV !== 'production') {
            this.router.get("/", validationResultMiddleware, asyncMiddleware(this.findAll));
            this.router.delete("/", validationResultMiddleware, asyncMiddleware(this.deleteAll));
        }
    }

    findById = async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params
        let foundModel = await this.service.findById(id);
        res.json(foundModel)
    };

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        let allModels = await this.service.findAll();
        res.json(allModels)
    };

    deleteAll = async (req: Request, res: Response, next: NextFunction) => {
        let deletedAll = await this.service.deleteAll();
        res.json(deletedAll)
    };

    getAllWithPagination = async (req: Request, res: Response, next: NextFunction) => {
        const {rowsInPage, pageNumber} = req.params;
        const nRowsInPage = Number.parseInt(rowsInPage)
        const nPageNumber = Number.parseInt(pageNumber)
        let pagination = await this.service.getAllWithPagination(nRowsInPage, nPageNumber);
        res.json(pagination)
    };

}


export default BaseCrudController;
