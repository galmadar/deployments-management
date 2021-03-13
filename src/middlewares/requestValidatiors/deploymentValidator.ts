import {body} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

export const createDeploymentValidatorHandler = [
    body("imageId").not().isEmpty(),
    body("userId").not().isEmpty(),
    validationResultMiddleware,
];
