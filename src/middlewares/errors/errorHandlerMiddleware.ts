import {Error} from "mongoose";
import {Boom} from "@hapi/boom";
import {NextFunction, Request, Response} from "express";

export let errorHandlerMiddleware = (err: Error | Boom, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Boom && err.isBoom) {
        let output = err.output;
        res.status(output.statusCode).json(output.payload);
    } else {
        res.status(500).json({message: "server error"});
    }
};
