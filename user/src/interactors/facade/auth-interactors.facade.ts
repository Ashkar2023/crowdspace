import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";
import { IOtpRepository } from "@interactors/interfaces/repositories/otp-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IHashService } from "@interactors/interfaces/services/hash-service.interface.js";
import { IMailService } from "@interactors/interfaces/services/mailer-service.interface.js";
import { IUserAuthenticationUsecase, loginData } from "@interactors/interfaces/auth/authentication-usecase.interface.js";
import { IOtpUsecase } from "@interactors/interfaces/auth/otp-usecase.interface.js";
import { IUserRegistrationUsecase } from "@interactors/interfaces/auth/registration-usecase.interface.js";
import { OtpImp } from "@interactors/otp.interactor.js";
import { UserAuthenticationImp } from "@interactors/user-authentication.interactor.js";
import { UserRegistrationImp } from "@interactors/user-registration.interactor.js";
import { IUserChecksUsecase } from "@interactors/interfaces/auth/user-checks-usecase.interface.js";
import { UserChecksImp } from "@interactors/user-checks.interactor.js";

export class AuthInteractorFacade implements IAuthInteractorFacade {
    private UserAuthenticationInstance: IUserAuthenticationUsecase;
    private OtpInstance: IOtpUsecase;
    private UserRegistrationInstance: IUserRegistrationUsecase;
    private UserChecksInstance : IUserChecksUsecase;

    constructor(
        UserRepository: IUserRepository,
        OtpRepository: IOtpRepository,
        HashService: IHashService,
        MailService: IMailService
    ) {
        this.UserAuthenticationInstance = new UserAuthenticationImp(UserRepository, HashService);
        this.OtpInstance = new OtpImp(OtpRepository, UserRepository, MailService);
        this.UserRegistrationInstance = new UserRegistrationImp(UserRepository, HashService);
        this.UserChecksInstance = new UserChecksImp(UserRepository);
    }


    async checkExistingUser(email: string) {
        return await this.UserChecksInstance.checkExistingUser(email);
    };

    async usernameExists(username: string) {
        return await this.UserChecksInstance.usernameExists(username);
    }

    async registerUser(user: IUser){
        return await this.UserRegistrationInstance.registerUser(user);
    }

    
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