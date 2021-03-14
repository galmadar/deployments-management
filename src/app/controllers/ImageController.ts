import ImageService from "../services/ImageService";
import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import {combinationValidator, createImageValidator} from "../middlewares/requestValidatiors/imageValidators";
import errorOnMiddlewareWrapper from "../middlewares/errors/errorOnMiddlewareWrapper";

export default class ImageController extends BaseCrudController {
    constructor() {
        super(ImageService);

        this.router.get("/secondMostCommon", errorOnMiddlewareWrapper(this.getSecondCommonImage));
        this.router.get(
            "/combination/:length",
            combinationValidator,
            errorOnMiddlewareWrapper(this.getCombinationByLength)
        );
        this.initDefaults({pagination: {}, withFindById: true});
        this.router.post("/", createImageValidator, errorOnMiddlewareWrapper(this.createImage));
        this.router.put("/:id", this.updateImage);
    }

    getSecondCommonImage = async (req: Request, res: Response, next: NextFunction) => {
        let imageService = this.service as typeof ImageService;
        let secondCommonImage = await imageService.getSecondCommonImage();
        res.json(secondCommonImage);
    };

    getCombinationByLength = async (req: Request, res: Response, next: NextFunction) => {
        const {length} = req.params;
        let imageService = this.service as typeof ImageService;
        let combinations = await imageService.getCombinationByLength(Number.parseInt(length));
        res.json(combinations);
    };

    createImage = async (req: Request, res: Response, next: NextFunction) => {
        let createdImage = await this.service.create(req.body);
        res.json(createdImage);
    };

    updateImage = async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        let updatedImage = await this.service.updateById(id, req.body);
        res.json(updatedImage);
    };
}
