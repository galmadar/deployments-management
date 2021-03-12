import {body} from "express-validator";
import {validationResultMiddleware} from "./baseValidators";

export const createUserValidatorHandler = [
    body('name').not().isEmpty(),
    body('email').isEmail(),
    validationResultMiddleware

]
