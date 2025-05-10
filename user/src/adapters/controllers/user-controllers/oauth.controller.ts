import { IOAuthController } from "../interfaces/oauth-controller.interface.js";
import { Request } from "express";
import { InternalServerError, ResponseCreator, expirationDate } from "@cr0wdspace/common";
import { oauthConfig } from "@src/config/oauth.js";
import generateRandomPassword from "@src/util/passwordGenerator.js";
import { OAuth2Client } from "google-auth-library";
import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";
import { envConfig } from "@src/config/env.config.js";
import { MongooseError } from "mongoose";

export class OAuthController implements IOAuthController {
    constructor(
        private AuthInteractorFacade: IAuthInteractorFacade
    ) { }

    async googleAuthSignup(req: Request) {

        const { code } = req.body;

        const googleClient = new OAuth2Client(
            process.env.OAUTH_CLIENT_ID,
            process.env.OAUTH_CLIENT_SECRET,
            envConfig.NODE_ENV === "production" ? oauthConfig.frontend_url : "http://localhost:5173"
        );

        const { tokens } = await googleClient.getToken(code as string); //code type is different to what this fn expects. 


        googleClient.setCredentials(tokens);

        const { access_token } = googleClient.credentials;
        const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
        const userData = await res.json();


        const existingUser = await this.AuthInteractorFacade.checkExistingUser(userData.email);

        if (!existingUser) {
            try {

                await this.AuthInteractorFacade.registerUser({
                    email: userData.email,
                    displayname: userData.name,
                    username: (userData.name as string).replace(/ /g, "_").toLowerCase().concat(Math.round(Math.random() * 1000).toString()), // fix username duplicate issue with TRIE
                    password: generateRandomPassword(),
                    avatar: userData.picture,
                    role: "user",
                    isVerified: true // ADD TYPE:oauth to doc
                })
            } catch (error) {
                if (error instanceof MongooseError) {
                    console.log(error)
                }
                console.log(error);
                throw new InternalServerError("user oauth error", 500);
            }
        }

        let { user, refreshToken, accessToken } = await this.AuthInteractorFacade.authenticateUser({
            credential: userData.email,
            password: "",
            type: "email"
        }, true)

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setHeaders({
                "Set-Cookie": [
                    `ajwt=${accessToken}; Path=/; Expires=${expirationDate(5, "minute")}; httpOnly;`,
                    `rjwt=${refreshToken}; Path=/; Expires=${expirationDate(1, "week")}; httpOnly;`
                ]
            })
            .setMessage("User authenticated")
            .setData({ ...user, type: "oauth" })
            .get();
    }
}