import {getModelForClass, prop} from "@typegoose/typegoose";
import BaseModel from "./BaseModel";

export class User extends BaseModel {
    @prop()
    name?: string;

    @prop()
    email?: string;

    @prop()
    metaData?: object;
}

export let UserModel = getModelForClass(User);
