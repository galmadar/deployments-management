import BaseCrudService from "./BaseCrudService";
import {DeploymentModel} from "../db/models/Deployment";
import logger from "../logger/logger";
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

    }

    async avgPerImage() {

    }

    async totalDeployments() {
        let deploymentCount = await (this.model as typeof DeploymentModel).count();
        let counterTxt = await FileUtils.readFile(this.countTxtPath);
        return {deploymentCount, counterTxt}
    }

    async totalDeploymentsPerImage() {
        let mostCommonImages = await this.model
            .aggregate([
                {$group: {_id: "$imageId", count: {$sum: 1}}},
                {$sort: {count: -1}},
                {$limit: 2}
            ])


    }
}

export default new DeploymentService()
