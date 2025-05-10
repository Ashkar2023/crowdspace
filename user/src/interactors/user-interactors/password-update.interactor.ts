import { BadRequestError, DatabaseOpError, expirationDate, signJWT } from "@cr0wdspace/common";
import { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import { IPasswordUpdateUsecase } from "../interfaces/user-usecase/settings/password-update-usecase.interface.js";
import { IHashService } from "../interfaces/services/hash-service.interface.js";
import { IMailService } from "@interactors/interfaces/services/mailer-service.interface.js";
import { envConfig } from "@src/config/env.config.js";
import { MongooseError } from "mongoose";

export class PasswordUpdateImp implements IPasswordUpdateUsecase {

    constructor(
        private _UserRepository: IUserRepository,
        private _HashService: IHashService,
        private _MailService: IMailService
    ) {

    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string) {

        const user = await this._UserRepository.findUserById(userId, "+password");

        if (!user) {
            throw new BadRequestError("Couldn't find User");
        } else {
            const conflict = await this._HashService.comparePassword(newPassword, user.password);
            if (conflict)
                throw new BadRequestError("New password conflicts with old password");
        }

        const isSame = await this._HashService.comparePassword(oldPassword, user.password);

        if (isSame) {
            const encryptedPwd = await this._HashService.hashPassword(newPassword);
            await this._UserRepository.updatePassword(user.email, encryptedPwd);

        } else {
            throw new BadRequestError("Incorrect old password");
        }

        return true
    };


    async resetForgottenPassword(email: string, newPassword: string) {
        const user = await this._UserRepository.findUser(email, "email")
        
        if (!user) {
            throw new BadRequestError("Couldn't find User");
        }
        
        const encryptedPwd = await this._HashService.hashPassword(newPassword);

        try{
            await this._UserRepository.updatePassword(user.email, encryptedPwd);
        }catch(error){
            if(error instanceof MongooseError){
                console.log(error)
                throw new DatabaseOpError(error.message)
            }
        }
        
        return true
    }
    
    async generateAndEmailResetLink(email: string){
        const user = await this._UserRepository.findUser(email, "email");

        if(!user){
            return false; // for safe response without error. should only mention the link has been sent even if sent/not.
        }

        /* FIX. blacklist the token after verification or store the token to database and delete when used */
        const emailToken = await signJWT({
            payload: {
                sub: email,
                iss: envConfig.ISSUER,
                aud: envConfig.AUDIENCE,
            },
            secret: envConfig.RESET_TOKEN_SECRET,
            tokenType:"RESET"
        })

        const mailInfo = await this._MailService.sendMail(user.email, `${envConfig.FRONTEND_URL}/auth/reset-password?token=${emailToken}`,"RESET_PASSWORD", "Reset password link");
        console.log(mailInfo, emailToken)
        return true;
    }
}