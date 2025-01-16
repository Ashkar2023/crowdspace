import { Request } from "express";
import { IUserRegistrationController } from "../interfaces/userRegistration-controller.interface.js";
import { ConflictError, ResponseCreator, BadRequestError } from "@cr0wdspace/common";
import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";
import { IValidationService } from "../interfaces/service/validation-service.interface.js";

export class UserRegistrationController implements IUserRegistrationController {

    constructor(
        private _AuthInteractorFacade: IAuthInteractorFacade,
        private _validator: IValidationService,
    ) { }

    async checkUsernameExists(req: Request) {
        const { username } = req.body;

        /* VALIDATION */
        this._validator.validateUsername(username);


        const result = await this._AuthInteractorFacade.usernameExists(username);

        if (result) throw new ConflictError("Username already found");


        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("Username doesn't exist")
            .get();
    };

    async registerUser(req: Request) {
        const userData: {
            displayname: string,
            username: string,
            email: string,
            password: string,
        } = req.body;

        /* VALIDATION */
        this._validator.validateDisplayname(userData.displayname);
        this._validator.validateUsername(userData.username);
        this._validator.validateEmail(userData.email);
        this._validator.validatePassword(userData.password);
        
        /* SANITIZEINPUT */

        // Username exist check 
        const exists = await this._AuthInteractorFacade.usernameExists(userData.username);
        if(exists){
            throw new ConflictError("Username already exists")
        }
        
        // Email exist check 
        const emailFound = await this._AuthInteractorFacade.checkExistingUser(userData.email);
        if (emailFound) {
            throw new ConflictError("User already exists")
        }

        const registeredUser = await this._AuthInteractorFacade.registerUser({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            displayname: userData.displayname,
            role:"user"
        });

        const response = new ResponseCreator();
        return response
            .setMessage("User created")
            .setData(registeredUser)
            .setStatusCode(201)
            .get();
    }
}