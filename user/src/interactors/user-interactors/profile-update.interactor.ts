import { BadRequestError, ConflictError, InternalServerError, UnauthorizedError } from "@crowdspace/common";
import { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import { IProfileUpdateUsecase, T_ProfileSetting } from "../interfaces/user-usecase/settings/profile-update-usecase.interface.js";
import { IUserChecksUsecase } from "../interfaces/user-usecase/auth/user-checks-usecase.interface.js";

export class ProfileImp implements IProfileUpdateUsecase {

    constructor(
        private _UserRepository: IUserRepository,
        private _UserChecksInstance: IUserChecksUsecase,
    ) {
    }

    async updateProfile(settings: T_ProfileSetting, userId: string) {

        const userFound = await this._UserRepository.findUserById(userId);

        if (!userFound) throw new BadRequestError("User not found")
        else if (userFound.username !== settings.username) {
            throw new BadRequestError("Username donot match");
        }

        const updatedUser = await this._UserRepository.updateProfileDetails(settings);

        return updatedUser;
    };

    async updateUsername(newUsername: string, userId: string) {

        const user = await this._UserRepository.findUserById(userId, "+_id");

        if (user) {
            if (user.username === newUsername)
                throw new BadRequestError("you've entered the same username", 400);

            const taken = await this._UserChecksInstance.usernameExists(newUsername);

            if (taken) throw new ConflictError("Username exists");

            const updated = await this._UserRepository.updateUsername(user._id, newUsername);

            if (updated) return newUsername;
            else throw new InternalServerError("Failed to update usernmae");
        }

        throw new UnauthorizedError("User not found", 404);
    }
}