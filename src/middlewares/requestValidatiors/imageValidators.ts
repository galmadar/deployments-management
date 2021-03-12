import {body, param} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

export const combinationValidator = [
    param('length').isNumeric(),
    validationResultMiddleware
]
export const createImageValidator = [
    body('name').not().isEmpty(),
    body('repository').not().isEmpty(),
    body('version').not().isEmpty(),
    validationResultMiddleware
]
