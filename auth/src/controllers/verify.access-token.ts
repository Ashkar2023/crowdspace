import { BadRequestError, decodeJWT, JWTPayload, ResponseCreator, TokenError, verifyJWT } from "@cr0wdspace/common";
import { Request } from "express";
import { isValidObjectId } from "mongoose";
import { RedisService } from "services/redis.client.js";



export const verifyAccessController = async (req: Request) => {
    const bearerToken = req.headers.authorization?.split(" ")[1] as string;

    if (!bearerToken) throw new TokenError("access token not found", 401, "invalid_access"); // already checking cookie in gateway, but for safety

    const verified = await verifyJWT({
        jwt: bearerToken,
        secret: process.env.TOKEN_SECRET!,
        issuerAndAudience: {
            issuer: process.env.ISSUER as string,
            audience: process.env.AUDIENCE as string,
        }
    })
    console.log("verified ", verified);

    if (!verified) throw new TokenError("access token expired", 401, "invalid_access");

    const { sub } = decodeJWT(bearerToken);

    const redisClient = RedisService.getInstance().getClient();
    const banned = await redisClient.SISMEMBER("bannedUsers", sub!);

    if (banned) {
        throw new BadRequestError("Account banned", 403,"banned");
    }

    if (!isValidObjectId(sub)) {
        throw new Error("JWT:sub not a valid userId");
    }

    const response = new ResponseCreator();
    return response
        .setData({ userId: sub })
        .setMessage("User verified")
        .setStatusCode(200)
        .get()
}