import BaseCrudService from "./BaseCrudService";
import {DeploymentModel} from "../db/models/Deployment";
import logger from "../utils/Logger";
import FileUtils from "../utils/FileUtils";
import {isNullOrUndefined} from "@typegoose/typegoose/lib/internal/utils";

class DeploymentService extends BaseCrudService {
    countTxtPath = "count.txt";

    constructor() {
        super(DeploymentModel);
    }


    findAll() {
        return this.model.find().populate('imageId userId');
    }

    async updateCounterTxt() {
        try {
            let counter: string | number | null = await FileUtils.readFile(this.countTxtPath);
            if (isNullOrUndefined(counter)) {
                counter = 0
            }
            counter = Number.parseInt(counter as string);
            (counter as number)++
            await FileUtils.writeFile(this.countTxtPath, counter.toString())
            return counter;
        } catch (err) {
            logger.error("Error in ", err)
        }
    }

    async create(model: any) {
        let createdDeployment = await super.create(model);
        this.updateCounterTxt().then(counter => {
            logger.info(`counter updated to ${counter}`);
        });
        return createdDeployment;
    }

    async avgPerUser() {
        const deploymentsPerUser = await this.model.aggregate([
            {$group: {_id: "$userId", count: {$sum: 1}}}
        ]);
        return this.countAvg(deploymentsPerUser, {sumKey: "deployments", countKey: "users"})
    }

    async avgPerImage() {
        const deploymentsPerUser = await this.model.aggregate([
            {$group: {_id: "$imageId", count: {$sum: 1}}}
        ]);
        return this.countAvg(deploymentsPerUser, {sumKey: "deployments", countKey: "images"})
    }

    countAvg = (arr: { count: number }[], options?: { sumKey?: string, countKey?: string, avgKey?: string }) => {
        const sum = arr.reduce(((acc, curr) => {
            return acc + curr.count
        }), 0);
        const count = arr.length;
        const average = sum / count;

        return {
            [options?.sumKey || "sum"]: sum,
            [options?.countKey || "count"]: count,
            [options?.avgKey || "average"]: average
        };
    }

    async totalDeployments() {
        let deploymentCount = await (this.model as typeof DeploymentModel).count();
        let counterTxt = await FileUtils.readFile(this.countTxtPath);
        return {deploymentCount, counterTxt}
    }

    async totalDeploymentsPerImage() {
        return this.model
            .aggregate([
                {$group: {_id: "$imageId", count: {$sum: 1}}},
                {
                    $lookup: {
                        from: "images",
                        localField: "_id",
                        foreignField: "_id",
                        as: "image"
                    }
                },
                // {$project: {count: 1}}
            ]);
    }
}

export default new DeploymentService()
