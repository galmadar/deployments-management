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

    getAllWithPagination = async (rowsInPage: number, pageNumber: number) => {
        try {
            const startIndex = (pageNumber - 1) * rowsInPage
            return await this.model
                .find()
                .sort({createdAt: 1})
                .skip(startIndex)
                .limit(rowsInPage)
        } catch (err) {

        }
    }

    updateById(id: string, model: any) {
        return this.model.findByIdAndUpdate(id, model, {new: true});
    }

    deleteAll() {
        return this.model.deleteMany({});
    }

}
