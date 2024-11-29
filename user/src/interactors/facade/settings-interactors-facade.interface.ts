import { ITokenUsecase } from "@interactors/interfaces/user-usecase/auth/token-usecase.interface.js";
import { IUserChecksUsecase } from "@interactors/interfaces/user-usecase/auth/user-checks-usecase.interface.js";
import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IHashService } from "@interactors/interfaces/services/hash-service.interface.js";
import { IPasswordUpdateUsecase } from "@interactors/interfaces/user-usecase/settings/password-update-usecase.interface.js";
import { IProfileUpdateUsecase, T_ProfileSetting } from "@interactors/interfaces/user-usecase/settings/profile-update-usecase.interface.js";
import { PasswordUpdateImp } from "@interactors/user-interactors/password-update.interactor.js";
import { ProfileImp } from "@interactors/user-interactors/profile-update.interactor.js";
import { TokenImp } from "@interactors/user-interactors/token.interactor.js";
import { UserChecksImp } from "@interactors/user-interactors/user-checks.interactor.js";

export class SettingsInteractorFacade implements ISettingsInteractorFacade {
    private _ProfileUpdateInstance: IProfileUpdateUsecase;
    private _PasswordUpdateInstance: IPasswordUpdateUsecase;
    private _TokenInstance: ITokenUsecase
    private _UserChecksInstance: IUserChecksUsecase;

    constructor(
        private UserRepository: IUserRepository,
        private HashService: IHashService,
    ) {
        this._UserChecksInstance = new UserChecksImp(UserRepository);
        this._PasswordUpdateInstance = new PasswordUpdateImp(UserRepository, HashService);
        this._ProfileUpdateInstance = new ProfileImp(UserRepository, this._UserChecksInstance);
        this._TokenInstance = new TokenImp();
    }

    async updateProfile(settings: T_ProfileSetting, userId: string) {
        return await this._ProfileUpdateInstance.updateProfile(settings, userId);
    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string) {
        return await this._PasswordUpdateInstance.updatePassword(userId, oldPassword, newPassword);
    };

    decodeToken(jwt: string) {
        return this._TokenInstance.decodeToken(jwt);
    }

    async updateUsername(newUsername: string, userId: string) {
        return await this._ProfileUpdateInstance.updateUsername(newUsername, userId);
    }
}