import {AdminModel} from "./models/Admin";
import logger from "../../utils/Logger";
import config from "../../config/config";

async function initDB() {
    try {
        const {userName, password} = config.initialAdminProps;

        /* Try to find an admin (according to configuration) */
        const foundAdmin = await AdminModel.findOne({userName, password});

        /* In case one found, Do nothing */
        if (foundAdmin) {
            logger.debug("admin exist:");
            logger.debug(foundAdmin);
            return foundAdmin;
        }

        /* Otherwise, Try to created an admin user (according to configuration) */
        try {
            const createdAdmin = await AdminModel.create({userName, password});
            logger.debug("created new Admin:");
            logger.debug(createdAdmin);
            return createdAdmin;
        } catch (err) {
            logger.error("Error on creating admin");
            logger.error(err);
        }
    } catch (err) {
        logger.error("Error on initAdmin", err);
    }
}

export {initDB};
