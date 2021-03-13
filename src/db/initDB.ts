import {initAdminProps} from "../config/adminConfig";
import {AdminModel} from "./models/Admin";
import logger from "../utils/Logger";

function initAdmin() {
    const {userName, password} = initAdminProps;
    AdminModel.findOne({userName, password})
        .then(foundAdmin => {
            if (foundAdmin) {
                logger.debug("admin exist:")
                logger.debug(foundAdmin)
                return foundAdmin
            }
            return AdminModel.create({userName, password})
                .then(createdAdmin => {
                    logger.debug("created new Admin:")
                    logger.debug(createdAdmin)
                    return createdAdmin
                })
                .catch(err => {
                    logger.error("Error on creating admin")
                    logger.error(err)
                });
        })
        .catch(err => {
            logger.error("Error on initAdmin")
            logger.error(err)
        });
}

export {initAdmin}
