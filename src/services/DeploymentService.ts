import BaseCrudService from "./BaseCrudService";
import {DeploymentModel} from "../db/models/Deployment";

class DeploymentService extends BaseCrudService {
    constructor() {
        super(DeploymentModel);
    }
}

export default new DeploymentService()
