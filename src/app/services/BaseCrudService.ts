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
        return this.model.find();
    }

    getAllWithPagination = async (rowsInPage: number, pageNumber: number) => {
        const startIndex = (pageNumber - 1) * rowsInPage;
        return this.findAll().sort({createdAt: 1}).skip(startIndex).limit(rowsInPage);
    };

    updateById(id: string, model: any) {
        delete model._id;
        delete model.createdAt;
        return this.model.findByIdAndUpdate(id, model, {new: true});
    }

    deleteAll() {
        return this.model.deleteMany({});
    }
}
