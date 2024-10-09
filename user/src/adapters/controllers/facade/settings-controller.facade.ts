import { Request } from "express";
import { ISettingsControllerFacade } from "../interfaces/ifacade/settings-controller-facade.interface.js";
import { IProfileController } from "../interfaces/profile-controller.interface.js";
import { ProfileController } from "../profile.controller.js";
import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { IResponse } from "@crowdspace/common";
import { IPasswordUpdateUsecase } from "@interactors/interfaces/settings/password-update-usecase.interface.js";
import { PasswordController } from "../password.controller.js";
import { IPasswordController } from "../interfaces/password-controller.interface.js";

export class SettingsControllerFacade implements ISettingsControllerFacade {
    private ProfileControllerInstance: IProfileController;
    private PasswordControllerInstance : IPasswordController;

    constructor(
        private SettingsInteractorFacade: ISettingsInteractorFacade
    ) {
        this.ProfileControllerInstance = new ProfileController(SettingsInteractorFacade);
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