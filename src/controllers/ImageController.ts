import ImageService from "../services/ImageService";
import BaseCrudController from "./BaseCrudController";
import {NextFunction, Request, Response} from "express";
import {createImageValidatorHandler} from "./requestValidatiors/ImageValidators";

class ImageController extends BaseCrudController {
    constructor() {
        super(ImageService);

        this.initGetSecondCommonImageRoute();
        this.initGetCombinationByLengthRoute();
        this.initDefaults({withPagination: true, withFindById: true});
        this.initCreateRoute();
        this.initUpdateRoute();
    }

    protected initGetSecondCommonImageRoute() {
        this.router.get("/secondMostCommon", async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let imageService = this.service as typeof ImageService;
                    let secondCommonImage = await imageService.getSecondCommonImage();
                    res.json(secondCommonImage)
                } catch (err) {
                    res.send("Error in getting secondCommonImageRoute")
                }
            }
        )
    }

    protected initGetCombinationByLengthRoute() {
        this.router.get("/combination/:length", async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const {length} = req.params;
                    const nLength = Number.parseInt(length);
                    let imageService = this.service as typeof ImageService;
                    let combinations = await imageService.getCombinationByLength(nLength);
                    res.json(combinations)
                } catch (err) {
                    res.send("Error in getting initGetCombinationByLengthRoute")
                }
            }
        )
    }

    protected initCreateRoute() {
        this.router.post("/",
            createImageValidatorHandler,
            async (req: Request, res: Response, next: NextFunction) => {
                let createdImage: any;
                try {
                    createdImage = await this.service.create(req.body);
                    res.json(createdImage)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }

    protected initUpdateRoute() {
        this.router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
                let updatedImage: any;
                try {
                    const {id} = req.params;
                    updatedImage = await this.service.updateById(id, req.body)
                    res.json(updatedImage)
                } catch (err) {
                    res.status(500)
                }
            }
        )
    }

}

let imageRouter = new ImageController().router;
export default imageRouter;
