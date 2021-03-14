import {Image, ImageModel} from "../db/models/Image";
import BaseCrudService from "./BaseCrudService";
import logger from "../../utils/Logger";

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
        return this.findCombinations(allImages, 0, length);
    };

    findCombinations(arr: string[], startIndex: number, r: number): string[][] {
        if (r === 1) {
            const result = [];
            for (let i = startIndex; i < arr.length; i++) {
                result.push([arr[i]]);
            }
            return result;
        }
        let tmpIndex = startIndex;
        const newResult: string[][] = [];
        while (tmpIndex < arr.length - r + 1) {
            const resultForR = this.findCombinations(arr, tmpIndex + 1, r - 1);
            resultForR.forEach((ar) => {
                newResult.push([arr[tmpIndex], ...ar]);
            });
            tmpIndex++;
        }
        return newResult;
    }
}

export default new ImageService();
