import {getModelForClass, index, prop} from "@typegoose/typegoose";
import BaseModel from "./BaseModel";

@index({name: 1})
export class Image extends BaseModel {
    @prop()
    name?: string;

    @prop()
    repository?: string;

    @prop()
    version?: string;
}

const ImageModel = getModelForClass(Image);
export {ImageModel};
