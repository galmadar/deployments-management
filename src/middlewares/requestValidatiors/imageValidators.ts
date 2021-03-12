import {body} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

export const createImageValidatorHandler = [
    body('name').not().isEmpty(),
    body('repository').not().isEmpty(),
    body('version').not().isEmpty(),
    validationResultMiddleware
]