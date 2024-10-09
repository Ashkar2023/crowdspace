import { ITokenUsecase } from "@interactors/interfaces/auth/token-usecase.interface.js";
import { IUserChecksUsecase } from "@interactors/interfaces/auth/user-checks-usecase.interface.js";
import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IHashService } from "@interactors/interfaces/services/hash-service.interface.js";
import { IPasswordUpdateUsecase } from "@interactors/interfaces/settings/password-update-usecase.interface.js";
import { IProfileUpdateUsecase, ProfileSettingDTO } from "@interactors/interfaces/settings/profile-update-usecase.interface.js";
import { PasswordUpdateImp } from "@interactors/password-update.interactor.js";
import { ProfileImp } from "@interactors/profile-update.interactor.js";
import { TokenImp } from "@interactors/token.interactor.js";
import { UserChecksImp } from "@interactors/user-checks.interactor.js";

export class SettingsInteractorFacade implements ISettingsInteractorFacade {
    private ProfileUpdateInstance: IProfileUpdateUsecase;
    private PasswordUpdateInstance: IPasswordUpdateUsecase;
    private TokenInstance: ITokenUsecase
    private UserChecksInstance: IUserChecksUsecase;

    constructor(
        private UserRepository: IUserRepository,
        private HashService: IHashService,
    ) {
        this.UserChecksInstance = new UserChecksImp(UserRepository);
        this.PasswordUpdateInstance = new PasswordUpdateImp(UserRepository, HashService);
        this.ProfileUpdateInstance = new ProfileImp(UserRepository, this.UserChecksInstance);
        this.TokenInstance = new TokenImp();
    }

    async updateProfile(settings: ProfileSettingDTO, userId: string) {
        return await this.ProfileUpdateInstance.updateProfile(settings, userId);
    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string) {
        return await this.PasswordUpdateInstance.updatePassword(userId, oldPassword, newPassword);
    };

    decodeToken(jwt: string) {
        return this.TokenInstance.decodeToken(jwt);
    }

    async updateUsername(newUsername: string, userId: string) {
        return await this.ProfileUpdateInstance.updateUsername(newUsername, userId);
    }
}