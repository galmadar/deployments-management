import {Image} from "./Image";
import {getModelForClass, prop, Ref} from "@typegoose/typegoose";
import {User} from "./User";
import BaseModel from "./BaseModel";

export class Deployment extends BaseModel {

    @prop({ref: () => Image})
    imageId?: Ref<Image>

    @prop({ref: () => User})
    userId?: Ref<User>
}

export const DeploymentModel = getModelForClass(Deployment)
