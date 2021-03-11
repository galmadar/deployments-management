import {getModelForClass, prop} from "@typegoose/typegoose";
import * as mongoose from 'mongoose';
import BaseModel from "./BaseModel";
import logger from "../../logger/logger";

export class User extends BaseModel {
    @prop()
    name?: string;

    @prop()
    email?: string;

    @prop({type: mongoose.Schema.Types.Mixed})
    metaData?: object;
}

const UserModel = getModelForClass(User);
UserModel.schema.index({name: 1});
UserModel.createIndexes().then(() => {
    logger.debug("Index created for UserModel");
})
export {UserModel};
