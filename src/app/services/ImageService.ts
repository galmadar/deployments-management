import {Image, ImageModel} from "../db/models/Image";
import BaseCrudService from "./BaseCrudService";
import logger from "../../utils/Logger";
import CollectionUtils from "../../utils/CollectionUtils";

class ImageService extends BaseCrudService {
    constructor() {
        super(ImageModel);
    }

    getSecondCommonImage = async () => {
        try {
            let imageModel = this.model as typeof ImageModel;
            let mostCommonImages = await imageModel.aggregate([
                {$group: {_id: "$name", count: {$sum: 1}}},
                {$sort: {count: -1}},
                {$limit: 2},
            ]);
            return mostCommonImages[1];
        } catch (err) {
            logger.error("Error in getting second most common image", err);
            throw err;
        }
    };

    getCombinationByLength = async (length: number) => {
        let allImages = (await this.model.find({})).map((image: Image) => image.name);
        return CollectionUtils.findCombinations(allImages, 0, length);
    };
}

export default new ImageService();
