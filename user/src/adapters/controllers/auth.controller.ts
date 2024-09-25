import { IAuthContoller } from "@adapters/controllers/interfaces/controller.interface.js";
import { BadRequestError, ResponseCreator, sign, validateReqBody } from "@crowdspace/common";
import { expirationDate } from "@crowdspace/common"; 
import { IAuthUsecases } from "@interactors/interfaces/interactor.interface.js";

import { Request } from "express";

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

        /* Correct cookies for production with secure and sameSite(if needed) */
    }
}