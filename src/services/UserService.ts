import {UserModel} from "../db/models/User";
import BaseCrudService from "./BaseCrudService";

class UserService extends BaseCrudService {
    constructor() {
        super(UserModel);
    }
}

export default new UserService()
