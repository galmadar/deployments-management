import BaseCrudService from "./BaseCrudService";
import {DeploymentModel} from "../db/models/Deployment";
import logger from "../logger/logger";
import FileUtils from "../utils/FileUtils";
import {isNullOrUndefined} from "@typegoose/typegoose/lib/internal/utils";

class DeploymentService extends BaseCrudService {
    countTxtLocation = "count.txt";

    constructor() {
        super(DeploymentModel);
    }

    updateCounterTxt = async () => {
        try {
            let counter: string | number | null = await FileUtils.readFile(this.countTxtLocation);
            if (isNullOrUndefined(counter)) {
                counter = 0
            }
            counter = Number.parseInt(counter as string);
            (counter as number)++
            await FileUtils.writeFile(this.countTxtLocation, counter.toString())
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
}

export default new DeploymentService()
