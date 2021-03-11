import {getModelForClass, prop} from "@typegoose/typegoose";
import BaseModel from "./BaseModel";
import logger from "../../logger/logger";

export class Image extends BaseModel {

    @prop()
    name?: string;

    @prop()
    repository?: string;

    @prop()
    version?: string;
}

const ImageModel = getModelForClass(Image)
ImageModel.schema.index({name: 1})
ImageModel.createIndexes().then(() => {
    logger.debug("Index created for ImageModel");
})
export {ImageModel}
