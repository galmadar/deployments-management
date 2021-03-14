import {body} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

export const adminLoginValidator = [
    body("userName").not().isEmpty(),
    body("password").not().isEmpty(),
    validationResultMiddleware,
];
export const createAdminValidator = [
    body("userName").not().isEmpty(),
    body("password").not().isEmpty(),
    validationResultMiddleware,
];
