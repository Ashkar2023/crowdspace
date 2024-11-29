import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IUserProfileUsecase } from "@interactors/interfaces/user-usecase/profile/userProfile-usecase.interface.js";

export class UserProfileImp implements IUserProfileUsecase {

    constructor(
        private _UserRepository:IUserRepository,
    ) {

    }

    async getUserProfile(username: string) {
        const userProfile = await this._UserRepository.getProfile(username);

        return userProfile
    }
}