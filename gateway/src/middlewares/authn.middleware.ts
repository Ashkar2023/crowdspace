import { TokenError } from "@crowdspace/common";
import { NextFunction, Request, Response } from "express";

const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ajwt } = req.cookies;

        if (!ajwt) {
            throw new TokenError("access token not found", 401, "invalid_access");
        }

        const response = await fetch("http://localhost:3030/auth/verify-access", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ajwt}`
            }
        })

        const { body, success } = await response.json();
        console.log(body, "----------")
        if (success) {

            req.headers["x-logged-in-user"] = body.userId;

            next()
        } else if (response.status === 401 && body.error === "invalid_access") {
            throw new TokenError("Invalid access token", response.status, "invalid_access");
        }

    } catch (error) {
        next(error)
    }
}

export default userAuthMiddleware;