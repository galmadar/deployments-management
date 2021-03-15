import {body} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

export const adminLoginRequestValidator = [
    body("userName").not().isEmpty(),
    body("password").not().isEmpty(),
    validationResultMiddleware,
];
export const createAdminRequestValidator = [
    body("userName").not().isEmpty(),
    body("password").not().isEmpty(),
    validationResultMiddleware,
];
