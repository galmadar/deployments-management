import {body} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

export const createDeploymentRequestValidator = [
    body("imageId").not().isEmpty(),
    body("userId").not().isEmpty(),
    validationResultMiddleware,
];

export const getStatisticsRequestValidator = (...actions: string[]) => [
    body("action").not().isEmpty(),
    body("action")
        .isIn(actions)
        .withMessage(`'action' should be one of: [${actions.join(", ")}]`),
    validationResultMiddleware,
];
