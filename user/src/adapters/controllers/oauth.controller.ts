import { IUserRegistrationUsecase } from "@interactors/interfaces/auth/registration-usecase.interface.js";
import { IOAuthController } from "./interfaces/oauth-controller.interface.js";
import { IUserAuthenticationUsecase } from "@interactors/interfaces/auth/authentication-usecase.interface.js";
import { Request } from "express";
import { ResponseCreator, expirationDate } from "@crowdspace/common";
import { oauthConfig } from "@src/config/oauth.js";
import generateRandomPassword from "@src/util/passwordGenerator.js";
import { OAuth2Client } from "google-auth-library";
import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";

export class OAuthController implements IOAuthController{
   
    constructor(
        private AuthInteractorFacade : IAuthInteractorFacade
    ){}

    async googleAuthSignup(req: Request) {

        const { code } = req.body;

        const googleClient = new OAuth2Client(
            process.env.OAUTH_CLIENT_ID,
            process.env.OAUTH_CLIENT_SECRET,
            oauthConfig.frontend_url
        );

        const { tokens } = await googleClient.getToken(code as string); //code type is different to what this fn expects. 


        googleClient.setCredentials(tokens);

        const { access_token } = googleClient.credentials;
        const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
        const userData = await res.json();


        const existingUser = await this.AuthInteractorFacade.checkExistingUser(userData.email);

        if (!existingUser) {
            await this.AuthInteractorFacade.registerUser({
                email: userData.email,
                displayname: userData.name,
                username: userData.name.replace(/ /g, "_").toLowerCase(),
                password: generateRandomPassword(),
                avatar: userData.picture,
                isVerified: true // ADD TYPE:oauth to doc
            })
        }

        let { user, refreshToken, accessToken } = await this.AuthInteractorFacade.authenticateUser({
            credential: userData.email,
            password: "nil",
            type: "email"
        })

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setHeaders({
                "Set-Cookie": [
                    `ajwt=${accessToken}; Path=/; Expires=${expirationDate(5, "minute")}; httpOnly;`,
                    `rjwt=${refreshToken}; Path=/; httpOnly;`
                ]
            })
            .setMessage("User authenticated")
            .setData({...user,type:"oauth"})
            .get();
    }
}