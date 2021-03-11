import {NextFunction, Request, Response} from "express";
import {param, body, validationResult} from "express-validator";

export const validationPaginationMiddleware = [
    param('pageNumber').isNumeric({no_symbols: true}),
    param('rowsInPage').isNumeric({no_symbols: true})
]

export const validationResultMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next()
};
