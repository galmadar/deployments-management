import {badData, badRequest, Boom, boomify} from "@hapi/boom";
import {NextFunction, Request, Response} from 'express';
import logger from "../../utils/Logger";

const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next)
            .catch(err => {
                if (err.name === "MongoError" && err.code === 11000) { /* MongoError on duplicate values */
                    next(badRequest(`duplicate key(s): '${Object.keys(err.keyPattern).join((","))}'`));
                } else if (err.name === "ValidationError") { /* MongoDB ValidationError */
                    next(badRequest(err.message))
                } else if (!err.isBoom) {
                    next(boomify(err, {message: err.message}));
                } else {
                    next(err);
                }
            })
    }
}

export default asyncMiddleware;
