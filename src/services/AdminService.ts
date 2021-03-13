import BaseCrudService from "./BaseCrudService";
import {AdminModel} from "../db/models/Admin";

class AdminService extends BaseCrudService {
    constructor() {
        super(AdminModel);
    }
}

export default new AdminService();
