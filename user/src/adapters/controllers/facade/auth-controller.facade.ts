import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";
import { IAuthControllerFacade } from "../interfaces/ifacade/auth-controller-facade.interface.js";
import { IOAuthController } from "../interfaces/oauth-controller.interface.js";
import { IUserAuthController } from "../interfaces/userAuth-controller.interface.js";
import { IUserRegistrationController } from "../interfaces/userRegistration-controller.interface.js";
import { IVerificationController } from "../interfaces/verification-controller.interface.js";
import { OAuthController } from "../user-controllers/oauth.controller.js";
import { UserAuthController } from "../user-controllers/userAuthentication.controller.js";
import { UserRegistrationController } from "../user-controllers/userRegistration.controller.js";
import { VerificationController } from "../user-controllers/verification.controller.js";
import { Request } from "express";
import { IValidationService } from "../interfaces/service/validation-service.interface.js";

export class AuthControllerFacade implements IAuthControllerFacade {
    private _OAuthControllerInstance: IOAuthController;
    private _UserAuthControllerInstance: IUserAuthController;
    private _UserRegistrationControllerInstance: IUserRegistrationController;
    private _VerificationControllerInstance: IVerificationController;

    constructor(
        private _AuthInteractorFacade: IAuthInteractorFacade,
        validatorService: IValidationService,
    ) {
        this._OAuthControllerInstance = new OAuthController(_AuthInteractorFacade);
        this._UserAuthControllerInstance = new UserAuthController(_AuthInteractorFacade,validatorService);
        this._UserRegistrationControllerInstance = new UserRegistrationController(_AuthInteractorFacade,validatorService);
        this._VerificationControllerInstance = new VerificationController(_AuthInteractorFacade);
    }

    // User Registration Controller
    async registerUser(req: Request) {
        return await this._UserRegistrationControllerInstance.registerUser(req);
    };

    async checkUsernameExists(req: Request) {
        return await this._UserRegistrationControllerInstance.checkUsernameExists(req);
    }


    // User Authentication Controller
    async loginUser(req: Request) {
        return await this._UserAuthControllerInstance.loginUser(req);
    }
    async logoutUser(req: Request) {
        return await this._UserAuthControllerInstance.logoutUser(req);
    }

    async refreshAccess(req: Request) {
        return await this._UserAuthControllerInstance.refreshAccess(req);
    }


    //OAuth Controller
    async googleAuthSignup(req: Request) {
        return await this._OAuthControllerInstance.googleAuthSignup(req);
    }

    
    //Verification Controller
    async generateAndSendOtp(req: Request) {
        return await this._VerificationControllerInstance.generateAndSendOtp(req);
    }

    async verifyAccount(req: Request) {
        return await this._VerificationControllerInstance.verifyAccount(req);
    }
}
