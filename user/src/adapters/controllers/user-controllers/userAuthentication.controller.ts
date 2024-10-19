import { Request } from "express";
import { IUserAuthController } from "../interfaces/userAuth-controller.interface.js";
import { ResponseCreator, expirationDate } from "@crowdspace/common";
import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";
import { IValidationService } from "../interfaces/service/validation-service.interface.js";

export class UserAuthController implements IUserAuthController {
    
    constructor(
        private _AuthInteractorFacade: IAuthInteractorFacade,
        private _validator : IValidationService,
    ) { }


    async loginUser(req: Request) {
        const { credential, password, type } = req.body;

        /*  VALIDATION */
        this._validator.validateCredentialType(type);
        if(type==="email"){
            this._validator.validateEmail(credential);
        }else if(type==="username"){
            this._validator.validateUsername(credential);
        }

        /* NoSQL sanitization */

        const { user, refreshToken, accessToken } = await this._AuthInteractorFacade.authenticateUser({
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
                    `ajwt=; Path=/; Expires=${expirationDate(-1, "day")}; Max-Age=0; httpOnly;`, //WHEN HOSTING - Add Domain
                    `rjwt=; Path=/; Expires=${expirationDate(-1, "day")}; Max-Age=0; httpOnly;`
                ]
            })
            .setMessage("Logout successful")
            .get();
    }

    async refreshAccess(req: Request) {
        const { rjwt } = req.cookies;

        const refreshToken = await this._AuthInteractorFacade.refreshAccessToken(rjwt);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("token re-authenticated")
            .setHeaders({
                "Set-Cookie": [`ajwt=${refreshToken}; Path=/; Expires=${expirationDate(5, "minute")}; httpOnly;`] //WHEN HOSTING - Add Domain
            })
            .get();
    };
}