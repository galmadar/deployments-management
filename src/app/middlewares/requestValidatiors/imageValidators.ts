import {body, param} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

/* prettier-ignore */
export const combinationRequestValidator = [
    param("length").isNumeric(),
    validationResultMiddleware
];

export const createImageRequestValidator = [
    body("name").not().isEmpty(),
    body("repository").not().isEmpty(),
    body("version").not().isEmpty(),
    validationResultMiddleware,
];
