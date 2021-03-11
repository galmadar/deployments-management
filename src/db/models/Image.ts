import {getModelForClass, prop} from "@typegoose/typegoose";
import BaseModel from "./BaseModel";

export class Image extends BaseModel {

    @prop()
    name?: string;

    @prop()
    repository?: string;

    @prop()
    version?: string;
}

export const ImageModel = getModelForClass(Image)
