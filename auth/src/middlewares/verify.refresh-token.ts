import { verifyJWT, TokenError } from "@crowdspace/common";
import { RequestHandler } from "express";

export const verifyRefreshToken: RequestHandler = async (req, res, next) => {
    try {
        const rjwt = req.headers.authorization?.split(" ")[1];

        req.cookies.rjwt = rjwt; //Setting values for next handler/controller
        
        if (!rjwt) throw new Error("Refresh Token not found");

        const result = await verifyJWT({
            jwt: rjwt,
            secret: process.env.TOKEN_SECRET as string,
            issuerAndAudience: {
                issuer: process.env.ISSUER as string,
                audience: process.env.AUDIENCE as string
            }
        })

        if (result) next();

    } catch (error) {
        console.log("middleware error: ", error) // DELETE

        if (error instanceof Error) {
            const err = new TokenError(error.message, 401, "invalid_refresh");
            next(err)
        }
    }
}