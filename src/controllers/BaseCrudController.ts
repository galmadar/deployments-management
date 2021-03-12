import {NextFunction, Request, Response} from "express";
import BaseCrudService from "../services/BaseCrudService";
import {validationPaginationMiddleware} from "../middlewares/requestValidatiors/baseValidators";
import asyncMiddleware from "../middlewares/async/async.middleware";
import BaseController from "./BaseController";

class BaseCrudController extends BaseController {

    constructor(service: BaseCrudService) {
        super(service);
    }

    protected initDefaults(options?: { withPagination?: { handlers?: any[] }, withFindById?: boolean }) {
        if (options?.withPagination) {
            this.router.get("/:pageNumber/:rowsInPage", validationPaginationMiddleware, ...(options.withPagination.handlers || []), asyncMiddleware(this.getAllWithPagination));
        }
        if (options?.withFindById) {
            this.router.get("/:id", asyncMiddleware(this.findById))
        }
        if (process.env.NODE_ENV !== 'production') {
            this.router.get("/", asyncMiddleware(this.findAll));
            this.router.delete("/", asyncMiddleware(this.deleteAll));
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
