import {Model} from "mongoose";

export default class BaseCrudService {
    protected model: Model<any>;

    constructor(model: Model<any>) {
        this.model = model;
    }

    create(model: any) {
        return this.model.create(model);
    }

    findById(id: string) {
        return this.model.findById(id);
    }

    findAll() {
        return this.model.find({});
    }

    updateById(id: string, model: any) {
        return this.model.findByIdAndUpdate(id, model, {new: true});
    }

    deleteAll() {
        return this.model.deleteMany({});
    }

}
