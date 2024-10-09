import { Request } from "express";
import { IUserRegistrationController } from "./interfaces/userRegistration-controller.interface.js";
import { validateReqBody, ConflictError, ResponseCreator, BadRequestError } from "@crowdspace/common";
import { IUserRegistrationUsecase } from "@interactors/interfaces/auth/registration-usecase.interface.js";
import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";

export class UserRegistrationController implements IUserRegistrationController{

    constructor(
        private AuthInteractorFacade : IAuthInteractorFacade
    ){}

    async checkUsernameExists(req: Request) {

        validateReqBody(req.body, ["username"]); // change to zod validation middleware

        const { username } = req.body;
        const result = await this.AuthInteractorFacade.usernameExists(username);

        if(result) throw new ConflictError("Username already found");

        const response = new ResponseCreator();

        return response
            .setStatusCode(200)
            .setMessage("Username doesn't exist")
            .get();
    };

    async registerUser(req: Request) {
        const userData = req.body;

        /* do ZOD */
        validateReqBody(userData, ["username", "email", "password", "displayname"]); 

        /* sanitizeInput */

        const emailFound = await this.AuthInteractorFacade.checkExistingUser(userData.email);

        if (emailFound) {
            throw new BadRequestError("User already exists", 403)
        }

        const registeredUser = await this.AuthInteractorFacade.registerUser({
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