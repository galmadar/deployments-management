import {prop} from "@typegoose/typegoose";

export default class BaseModel {

    @prop({default: () => new Date()})
    createdAt?: Date;

}
