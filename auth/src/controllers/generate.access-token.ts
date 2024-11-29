import { decodeJWT, ResponseCreator, signJWT } from "@crowdspace/common";
import { Request } from "express";

export const generateAccessToken = async (req: Request) => {
    const { sub, username } = decodeJWT(req.cookies.rjwt);

    // check for user in database and verify
    // rather than blindly regenerating the access token

    const accessToken = await signJWT({
        secret: (process.env.TOKEN_SECRET as string),
        payload: {
            iss: process.env.ISSUER as string,
            aud: process.env.AUDIENCE as string,
            sub: sub,
            username: username,
            type: "ACCESS"
        },
        tokenType: "ACCESS"
    })

    const response = new ResponseCreator()
    return response
        .setData({newAccessToken:accessToken})
        .setMessage("access token generated")
        .setStatusCode(200)
        .get();
};
