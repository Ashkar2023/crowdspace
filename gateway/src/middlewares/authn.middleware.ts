import { BadRequestError, TokenError, UnauthorizedError } from "@cr0wdspace/common";
import { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/env.config.js";

const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ajwt } = req.cookies;
        
        if (!ajwt) {
            throw new TokenError("access token not found", 401, "invalid_access");
        }

        const response = await fetch(process.env.AUTH_SERVICE + "/auth/verify-access", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ajwt}`
            }
        })

        const { body, success, error, message } = await response.json();
        console.log("/auth/verify", response.status)
        // console.log("/auth/verify body",body)
        // console.log("/auth/verify error",error)

        if (success) {
            req.headers["x-logged-in-user"] = body.userId;
            next()
        } else if (response.status === 401 && error === "invalid_access") {
            throw new TokenError("Invalid access token", response.status, "invalid_access");
        } else if (response.status === 403 && error === "access_denied") {
            throw new UnauthorizedError("Access denied", 403);
        } else if (response.status === 403 && error === "banned") {
            throw new BadRequestError(message, response.status, error)
        }

    } catch (error) {
        next(error)
    }
}

export default userAuthMiddleware;