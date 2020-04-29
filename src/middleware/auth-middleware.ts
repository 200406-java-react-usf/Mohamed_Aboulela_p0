import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../errors/errors";

export const adminGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.sendStatus(401).send(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'Admin') {
        next();
    } else {
        resp.sendStatus(403).send(new AuthorizationError());
    }

}