import {badRequest, boomify} from "@hapi/boom";
import {NextFunction, Request, Response} from "express";

const validateMongoError = (req: Request, res: Response, next: NextFunction, err: any) => {
    if (err.name === "MongoError" && err.code === 11000) {
        /* MongoError on duplicate values */
        next(badRequest(`duplicate key(s): '${Object.keys(err.keyPattern).join(",")}'`));
        return true;
    } else if (err.name === "ValidationError") {
        /* MongoDB ValidationError */
        next(badRequest(err.message));
        return true;
    }
    return false;
};

const asyncErrorWrapper = (middleware: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        middleware(req, res, next).catch((err) => {
            if (validateMongoError(req, res, next, err)) {
                return;
            } else if (!err.isBoom) {
                next(boomify(err, {message: err.message}));
            } else {
                next(err);
            }
        });
    };
};

export default asyncErrorWrapper;
