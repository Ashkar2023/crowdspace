import { TokenError, UnauthorizedError, verify } from "@crowdspace/common";
import { RequestHandler } from "express";

export const verifyAccessToken: RequestHandler = async (req, res, next) => {
    try {
        const { ajwt } = req.cookies;

        if (!ajwt) throw new Error("Access Token not found");

        const result = await verify({
            jwt: ajwt,
            secret: process.env.TOKEN_SECRET as string,
            issuerAndAudience: {
                issuer: process.env.ISSUER as string,
                audience: process.env.AUDIENCE as string
            }
        })

        console.log("result :", result) // DELETE
        if (result) next();

    } catch (error) {
        // SHOULD DELEGATE TO GLOBAL ERROR HANDLER
        if (error instanceof Error) {
            console.log("error: ", error.message) // DELETE

            const err = new TokenError(error.message, 401, "invalid_access");
            next(err)
        }
    }
}

export const verifyRefreshToken: RequestHandler = async (req, res, next) => {
    try {
        const { rjwt } = req.cookies;

        if (!rjwt) throw new Error("Refresh Token not found");

        const result = await verify({
            jwt: rjwt,
            secret: process.env.TOKEN_SECRET as string,
            issuerAndAudience: {
                issuer: process.env.ISSUER as string,
                audience: process.env.AUDIENCE as string
            }
        })

        if (result) next();

    } catch (error) {
        // SHOULD DELEGATE TO GLOBAL ERROR HANDLER
        if (error instanceof Error) {

            const err = new TokenError(error.message, 401, "invalid_refresh");
            next(err)
        }
    }
}