import { Request } from "express";
import { IUserAuthController } from "./interfaces/userAuth-controller.interface.js";
import { ResponseCreator, expirationDate } from "@crowdspace/common";
import { IUserAuthenticationUsecase } from "@interactors/interfaces/user/authentication-usecase.interface.js";
import { IAuthFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";

export class UserAuthController implements IUserAuthController {
    
    constructor(
        private AuthFacade: IAuthFacade
    ) { }


    async loginUser(req: Request) {
        const { credential, password, type } = req.body;

        const { user, refreshToken, accessToken } = await this.AuthFacade.authenticateUser({
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

    async refreshAccess(req: Request) {
        const { rjwt } = req.cookies;

        const refreshToken = await this.AuthFacade.refreshAccessToken(rjwt);

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