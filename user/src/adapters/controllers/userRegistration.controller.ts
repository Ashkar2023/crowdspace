import { Request } from "express";
import { IUserRegistrationController } from "./interfaces/userRegistration-controller.interface.js";
import { validateReqBody, ConflictError, ResponseCreator, BadRequestError } from "@crowdspace/common";
import { IUserRegistrationUsecase } from "@interactors/interfaces/user/registration-usecase.interface.js";
import { IAuthFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";

export class UserRegistrationController implements IUserRegistrationController{

    constructor(
        private AuthFacade : IAuthFacade
    ){}

    async checkUsernameExists(req: Request) {

        validateReqBody(req.body, ["username"]); // change to zod validation middleware

        const { username } = req.body;
        const result = await this.AuthFacade.usernameExists(username);

        if(result) throw new ConflictError("Username already found");

        const response = new ResponseCreator();

        return response
            .setStatusCode(200)
            .setMessage("Username doesn't exist")
            .get();
    };

    async registerUser(req: Request) {
        const userData = req.body;

        // make this into a package validation like joi/yup
        validateReqBody(userData, ["username", "email", "password", "displayname"]);

        /* sanitizeInput */

        const emailFound = await this.AuthFacade.checkExistingUser(userData.email);

        if (emailFound) {
            throw new BadRequestError("User with email already exists", 403)
        }

        const registeredUser = await this.AuthFacade.registerUser({
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
}