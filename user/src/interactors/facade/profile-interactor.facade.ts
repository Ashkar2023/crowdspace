import { IProfileInteractorFacade } from "@interactors/interfaces/ifacade/profile-interactor.facade.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IUserProfileUsecase } from "@interactors/interfaces/user-usecase/profile/userProfile-usecase.interface.js";
import { UserProfileImp } from "@interactors/user-interactors/user-profile.interactor.js";

export class ProfileInteractorFacade implements IProfileInteractorFacade {
    private _UserProfileInteractorInstance: IUserProfileUsecase

    constructor(
        UserRepository: IUserRepository
    ) {
        this._UserProfileInteractorInstance = new UserProfileImp(UserRepository)
    }

    async getUserProfile(username: string) {
        return await this._UserProfileInteractorInstance.getUserProfile(username);
    }
}