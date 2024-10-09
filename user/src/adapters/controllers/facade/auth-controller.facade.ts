import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";
import { IAuthControllerFacade } from "../interfaces/ifacade/auth-controller-facade.interface.js";
import { IOAuthController } from "../interfaces/oauth-controller.interface.js";
import { IUserAuthController } from "../interfaces/userAuth-controller.interface.js";
import { IUserRegistrationController } from "../interfaces/userRegistration-controller.interface.js";
import { IVerificationController } from "../interfaces/verification-controller.interface.js";
import { OAuthController } from "../oauth.controller.js";
import { UserAuthController } from "../userAuth.controller.js";
import { UserRegistrationController } from "../userRegistration.controller.js";
import { VerificationController } from "../verification.controller.js";
import { Request } from "express";

export class AuthControllerFacade implements IAuthControllerFacade {
    private OAuthControllerInstance: IOAuthController;
    private UserAuthControllerInstance: IUserAuthController;
    private UserRegistrationControllerInstance: IUserRegistrationController;
    private VerificationControllerInstance: IVerificationController;

    constructor(
        private AuthInteractorFacade: IAuthInteractorFacade,
    ) {
        this.OAuthControllerInstance = new OAuthController(AuthInteractorFacade);
        this.UserAuthControllerInstance = new UserAuthController(AuthInteractorFacade);
        this.UserRegistrationControllerInstance = new UserRegistrationController(AuthInteractorFacade);
        this.VerificationControllerInstance = new VerificationController(AuthInteractorFacade);
    }

    // User Registration Controller
    async registerUser(req: Request) {
        return await this.UserRegistrationControllerInstance.registerUser(req);
    };

    async checkUsernameExists(req: Request) {
        return await this.UserRegistrationControllerInstance.checkUsernameExists(req);
    }


    // User Authentication Controller
    async loginUser(req: Request) {
        return await this.UserAuthControllerInstance.loginUser(req);
    }
    async logoutUser(req: Request) {
        return await this.UserAuthControllerInstance.logoutUser(req);
    }

    async refreshAccess(req: Request) {
        return await this.UserAuthControllerInstance.refreshAccess(req);
    }


    //OAuth Controller
    async googleAuthSignup(req: Request) {
        return await this.OAuthControllerInstance.googleAuthSignup(req);
    }

    
    //Verification Controller
    async generateAndSendOtp(req: Request) {
        return await this.VerificationControllerInstance.generateAndSendOtp(req);
    }

    async verifyAccount(req: Request) {
        return await this.VerificationControllerInstance.verifyAccount(req);
    }
}
