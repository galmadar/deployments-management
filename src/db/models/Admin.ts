import {getModelForClass, prop} from "@typegoose/typegoose";
import BaseModel from "./BaseModel";
import {ObjectId} from "mongoose";

export class Admin extends BaseModel {
    _id: ObjectId;

    @prop()
    userName?: string;

    @prop()
    password?: string;
}

export const AdminModel = getModelForClass(Admin);
