import {ImageModel} from "../db/models/Image";
import BaseCrudService from "./BaseCrudService";
import logger from "../logger/logger";

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
                {$limit: 2}
            ])
            return mostCommonImages[1];
        } catch (err) {
            logger.error("Error in getting second most common image", err);
            throw err;
        }
    }

    getAllWithPagination = async (rowsInPage: number, pageNumber: number) => {
        try {
            const startIndex = (pageNumber - 1) * rowsInPage
            let imageModel = this.model as typeof ImageModel;
            return await imageModel
                .find()
                .sort({createdAt: 1})
                .skip(startIndex)
                .limit(rowsInPage)
        } catch (err) {

        }
    }

    getCombinationByLength = async (length: number) => {
        let imageModel = this.model as typeof ImageModel;
        let mostCommonImages = await imageModel.aggregate([
            {$group: {_id: "$name"}},
            {$sort: {count: -1}},
            {$limit: 2}
        ])
        return mostCommonImages[1];
    }
}

export default new ImageService()
