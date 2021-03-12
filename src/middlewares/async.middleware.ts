import {badData, badRequest, Boom, boomify} from "@hapi/boom";
import {NextFunction, Request, Response} from 'express';
import logger from "../logger/logger";

const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next)
            .catch(err => {
                if (err.name === "MongoError" && err.code === 11000) {
                    next(badRequest(`duplicate key(s): '${Object.keys(err.keyPattern).join((","))}'`));
                } else if (!err.isBoom) {
                    next(boomify(err, {message: err.message}));
                } else {
                    next(err);
                }
            })
    }
}

export default asyncMiddleware;
