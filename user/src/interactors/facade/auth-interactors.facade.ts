import { IOtp } from "@entities/interfaces/otp-entity.interface.js";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IAuthFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";
import { IOtpRepository } from "@interactors/interfaces/repositories/otp-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IHashService } from "@interactors/interfaces/services/hash-service.interface.js";
import { IMailService } from "@interactors/interfaces/services/mailer-service.interface.js";
import { IUserAuthenticationUsecase, loginData } from "@interactors/interfaces/user/authentication-usecase.interface.js";
import { IOtpUsecase } from "@interactors/interfaces/user/otp-usecase.interface.js";
import { IUserRegistrationUsecase } from "@interactors/interfaces/user/registration-usecase.interface.js";
import { OtpImp } from "@interactors/otp.interactor.js";
import { UserAuthenticationImp } from "@interactors/user-authentication.interactor.js";
import { UserRegistrationImp } from "@interactors/user-registration.interactor.js";
import { HydratedDocument } from "mongoose";

export class AuthInteractorFacade implements IAuthFacade {
    private UserAuthenticationInstance: IUserAuthenticationUsecase;
    private OtpInstance: IOtpUsecase;
    private UserRegistrationInstance: IUserRegistrationUsecase;

    constructor(
        UserRepository: IUserRepository,
        OtpRepository: IOtpRepository,
        HashService: IHashService,
        MailService: IMailService
    ) {
        this.UserAuthenticationInstance = new UserAuthenticationImp(UserRepository, HashService);
        this.OtpInstance = new OtpImp(OtpRepository, UserRepository, MailService);
        this.UserRegistrationInstance = new UserRegistrationImp(UserRepository, HashService);
    }


    //-> User Authentication Usecases
    async checkExistingUser(email: string) {
        return await this.UserRegistrationInstance.checkExistingUser(email);
    };

    async usernameExists(username: string) {
        return await this.UserRegistrationInstance.usernameExists(username);
    }

    async registerUser(user: IUser){
        return await this.UserRegistrationInstance.registerUser(user);
    }

    
    //-> User Registration Usecases
    async authenticateUser(loginData: loginData){
        return await this.UserAuthenticationInstance.authenticateUser(loginData)
    };

    async refreshAccessToken(cookie: string){
        return await this.UserAuthenticationInstance.refreshAccessToken(cookie);
    }


    //-> OTP usecases
    async genAndSendOtpMail(email: string){
        return await this.OtpInstance.genAndSendOtpMail(email);
    }

    async verifyOtp(email: string, otp: string){
        return await this.OtpInstance.verifyOtp(email,otp);
    };
}