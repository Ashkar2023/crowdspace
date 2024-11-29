import { Request } from "express";
import { ISettingsControllerFacade } from "../interfaces/ifacade/settings-controller-facade.interface.js";
import { IProfileUpdateController } from "../interfaces/profile-update-controller.interface.js";
import { ProfileUpdateController } from "../user-controllers/profile-update.controller.js";
import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { PasswordController } from "../user-controllers/password.controller.js";
import { IPasswordController } from "../interfaces/password-controller.interface.js";

export class SettingsControllerFacade implements ISettingsControllerFacade {
    private ProfileControllerInstance: IProfileUpdateController;
    private PasswordControllerInstance : IPasswordController;

    constructor(
        private SettingsInteractorFacade: ISettingsInteractorFacade
    ) {
        this.ProfileControllerInstance = new ProfileUpdateController(SettingsInteractorFacade);
        this.PasswordControllerInstance = new PasswordController(SettingsInteractorFacade)
    };

    async updateProfile(req: Request) {
        return await this.ProfileControllerInstance.updateProfile(req);
    };

    async updatePassword(req: Request){
        return await this.PasswordControllerInstance.updatePassword(req);
    };

    async updateUsername(req: Request){
        return await this.ProfileControllerInstance.updateUsername(req);
    }
}