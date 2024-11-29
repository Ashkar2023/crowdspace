import { expirationDate, ResponseCreator, TokenError } from "@crowdspace/common";
import { Request } from "express";

export const refreshAccessToken = async (req: Request) => {

    if (!req.cookies.rjwt) throw new TokenError("Refresh token not found", 401, "invalid_refresh");

    const authResponse = await fetch(process.env.AUTH_SERVICE + req.path, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.rjwt}`
        }
    });

    const data = await authResponse.json();

    const response = new ResponseCreator();
    return response
        // setHeaders() is only setting one header right now, change to multiple headers setup
        .setHeaders({ "Set-cookie": `ajwt=${data.body.newAccessToken}; path=/; Expires=${expirationDate(5, 'minute')}; httpOnly;` })
        .setMessage(data.message)
        .setStatusCode(200)
        .get();
};
