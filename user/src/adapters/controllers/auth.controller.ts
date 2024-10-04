import { IAuthContoller } from "@adapters/controllers/interfaces/auth-controller.interface.js";
import { BadRequestError, IResponse, ResponseCreator, sign, validateReqBody } from "@crowdspace/common";
import { expirationDate } from "@crowdspace/common";
import { IAuthUsecases } from "@interactors/interfaces/usecases.interface.js";
import { oauthConfig } from "@src/config/oauth.js";
import generateRandomPassword from "@src/util/passwordGenerator.js";
import { Request } from "express";

import { OAuth2Client } from "google-auth-library"; //write to oauth service

export class AuthControllerImp implements IAuthContoller {
    private interactor: IAuthUsecases

    constructor(interactor: IAuthUsecases) {
        this.interactor = interactor;
    }

    async registerUser(req: Request) {
        const userData = req.body;

        // make this into a package validation like joi/yup
        validateReqBody(userData, ["username", "email", "password", "displayname"]);

        /* sanitizeInput */

        const emailFound = await this.interactor.checkExistingUser(userData.email);

        if (emailFound) {
            throw new BadRequestError("User with email already exists", 403)
        }

        const registeredUser = await this.interactor.registerUser({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            displayname: userData.displayname
        });

        const response = new ResponseCreator();
        return response
            .setMessage("User created")
            .setData(registeredUser)
            .setStatusCode(201)
            .get();
    }

    async loginUser(req: Request) {
        const { credential, password, type } = req.body;

        const { user, refreshToken, accessToken } = await this.interactor.authenticateUser({
            credential,
            password,
            type
        });

        const response = new ResponseCreator();
        /* Correct cookies for production with secure and sameSite(if needed) */
        return response
            .setStatusCode(200)
            .setHeaders({
                "Set-Cookie": [
                    `ajwt=${accessToken}; Path=/; Expires=${expirationDate(5, "minute")}; httpOnly;`,
                    `rjwt=${refreshToken}; Path=/; Expires=${expirationDate(1, "week")}; httpOnly;`
                ]
            })
            .setMessage("User authenticated")
            .setData(user)
            .get();

    }


    async logoutUser(req: Request) {

        //no bussiness logic

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setHeaders({
                "Set-Cookie": [
                    `ajwt=; Path=/; Expires=${expirationDate(-1, "day")}; Max-Age=0; httpOnly;`,
                    `rjwt=; Path=/; Expires=${expirationDate(-1, "day")}; Max-Age=0; httpOnly;`
                ]
            })
            .setMessage("User logged out")
            .get();
    }


    async googleAuthSignup(req: Request) {

        const { code } = req.body;
        console.log(code)

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


        const existingUser = await this.interactor.checkExistingUser(userData.email);

        if (!existingUser) {
            await this.interactor.registerUser({
                email: userData.email,
                displayname: userData.name,
                username: userData.name.replace(/ /g, "_"),
                password: generateRandomPassword(),
                avatar: userData.picture,
                isVerified: true // ADD TYPE:oauth to doc
            })
        }

        let { user, refreshToken, accessToken } = await this.interactor.authenticateUser({
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
                    `rjwt=${refreshToken}; Path=/; Expires=${expirationDate(1, "week")}; httpOnly;`
                ]
            })
            .setMessage("User authenticated")
            .setData({...user,type:"oauth"})
            .get();
    }

    async generateAndSendOtp(req: Request) {
        const { email } = req.body;

        const sent = await this.interactor.genAndSendOtpMail(email);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("New OTP sent via email")
            .get();
    }

    async verifyAccount(req: Request) {
        const { email, otp } = req.body;

        const updatedUser = await this.interactor.verifyOtp(email, otp);

        if (updatedUser === false) throw new BadRequestError("Incorrect OTP");

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setData(updatedUser.toObject())
            .setMessage("Account verified")
            .get();
    };

    async refreshAccess(req: Request) {
        const { rjwt } = req.cookies;

        const refreshToken = await this.interactor.refreshAccessToken(rjwt);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("token re-authenticated")
            .setHeaders({
                "Set-Cookie": [`ajwt=${refreshToken}; Path=/; Expires=${expirationDate(5, "minute")}; httpOnly;`]
            })
            .get();
    };
}