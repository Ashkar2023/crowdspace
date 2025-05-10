import { BadRequestError, decodeJWT, IResponse, passwordSchema, ResponseCreator, verifyJWT } from "@cr0wdspace/common";
import { Request } from "express";
import { IPasswordController } from "../interfaces/password-controller.interface.js";
import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { IValidationService } from "../interfaces/service/validation-service.interface.js";
import { IMailService } from "@interactors/interfaces/services/mailer-service.interface.js";
import { envConfig } from "@src/config/env.config.js";

export class PasswordController implements IPasswordController {

    constructor(
        private _SettingsInteractorFacade: ISettingsInteractorFacade,
        private _ValidatorService: IValidationService,
        private _MailService: IMailService
    ) {

    }

    async updatePassword(req: Request) {
        const { oldPassword, newPassword } = req.body;
        const loggedInUser = req.headers["x-logged-in-user"] as string;

        this._ValidatorService.validatePassword(oldPassword);
        this._ValidatorService.validatePassword(newPassword);

        await this._SettingsInteractorFacade
            .updatePassword(
                loggedInUser,
                oldPassword,
                newPassword
            );

        const response = new ResponseCreator();
        return response.setStatusCode(200)
            .setMessage("Password Updated")
            .get();
    }

    async sendPasswordResetLink(req: Request) {
        const email = req.body.email as string;

        this._ValidatorService.validateEmail(email);

        const resetLinkSent = await this._SettingsInteractorFacade.generateAndEmailResetLink(email)

        /* for logging purposes, log if the reset link has actually sent */

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("Email sent with reset link")
            .setData({})
            .get();
    }

    async resetPassword(req: Request) {
        const token = req.query.token as string;
        const newPassword = req.body.newPassword as string;

        this._ValidatorService.validate(newPassword, passwordSchema);

        const valid = verifyJWT({
            jwt: token,
            secret: envConfig.RESET_TOKEN_SECRET,
            issuerAndAudience: {
                issuer: envConfig.ISSUER,
                audience: envConfig.AUDIENCE,
            }
        }); // FIX make it a service class

        if (!valid) {
            throw new BadRequestError("Invalid token")
        }

        const { sub, exp } = decodeJWT(token); // FIX make it a service class

        const passwordReset = await this._SettingsInteractorFacade.resetForgottenPassword(sub!, newPassword)

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("password reset success")
            .setData({})
            .get();
    }
}