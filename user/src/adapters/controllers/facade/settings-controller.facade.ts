import { Request } from "express";
import { ISettingsControllerFacade } from "../interfaces/ifacade/settings-controller-facade.interface.js";
import { IProfileUpdateController } from "../interfaces/profile-update-controller.interface.js";
import { ProfileUpdateController } from "../user-controllers/profile-update.controller.js";
import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { PasswordController } from "../user-controllers/password.controller.js";
import { IPasswordController } from "../interfaces/password-controller.interface.js";
import { IValidationService } from "../interfaces/service/validation-service.interface.js";
import { IMailService } from "@interactors/interfaces/services/mailer-service.interface.js";
import { IResponse } from "@cr0wdspace/common";

export class SettingsControllerFacade implements ISettingsControllerFacade {
    private _ProfileControllerInstance: IProfileUpdateController;
    private _PasswordControllerInstance: IPasswordController;

    constructor(
        private _SettingsInteractorFacade: ISettingsInteractorFacade,
        validationService: IValidationService,
        mailService: IMailService
    ) {
        this._ProfileControllerInstance = new ProfileUpdateController(_SettingsInteractorFacade, validationService);
        this._PasswordControllerInstance = new PasswordController(_SettingsInteractorFacade, validationService, mailService)
    };

    async updateProfile(req: Request) {
        return await this._ProfileControllerInstance.updateProfile(req);
    };

    async updatePassword(req: Request) {
        return await this._PasswordControllerInstance.updatePassword(req);
    };

    async updateUsername(req: Request) {
        return await this._ProfileControllerInstance.updateUsername(req);
    }

    async updatePrivacy(req: Request) {
        return await this._ProfileControllerInstance.updatePrivacy(req);
    }

    async sendPasswordResetLink(req: Request) {
        return await this._PasswordControllerInstance.sendPasswordResetLink(req);
    }
    
    async resetPassword(req: Request) {
        return await this._PasswordControllerInstance.resetPassword(req);
    }
}