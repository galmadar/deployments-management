import {body} from "express-validator";
import {validationResultMiddleware} from "./BaseValidators";

export const createDeploymentValidatorHandler = [
    body('imageId').not().isEmpty(),
    body('userId').not().isEmpty(),
    validationResultMiddleware,
]
