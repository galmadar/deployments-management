import ImageService from "../services/ImageService";
import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import {createImageValidatorHandler} from "../middlewares/requestValidatiors/imageValidators";
import asyncMiddleware from "../middlewares/async/async.middleware";

class ImageController extends BaseCrudController {
    constructor() {
        super(ImageService);

        this.router.get("/secondMostCommon", asyncMiddleware(this.getSecondCommonImage))
        this.router.get("/combination/:length", asyncMiddleware(this.getCombinationByLength))
        this.initDefaults({withPagination: true, withFindById: true});
        this.router.post("/", createImageValidatorHandler, asyncMiddleware(this.createImage))
        this.router.put("/:id", this.updateImage)
    }

    getSecondCommonImage = async (req: Request, res: Response, next: NextFunction) => {
        let imageService = this.service as typeof ImageService;
        let secondCommonImage = await imageService.getSecondCommonImage();
        res.json(secondCommonImage)
    }

    getCombinationByLength = async (req: Request, res: Response, next: NextFunction) => {
        const {length} = req.params;
        const nLength = Number.parseInt(length);
        let imageService = this.service as typeof ImageService;
        let combinations = await imageService.getCombinationByLength(nLength);
        res.json(combinations)
    }

    createImage = async (req: Request, res: Response, next: NextFunction) => {
        let createdImage = await this.service.create(req.body);
        res.json(createdImage)
    }

    updateImage = async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        let updatedImage = await this.service.updateById(id, req.body)
        res.json(updatedImage)
    }

}

let imageRouter = new ImageController().router;
export default imageRouter;
