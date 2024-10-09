import { BadRequestError, ConflictError, InternalServerError, UnauthorizedError } from "@crowdspace/common";
import { IUserRepository } from "./interfaces/repositories/user-repository.interface.js";
import { IProfileUpdateUsecase, ProfileSettingDTO } from "./interfaces/settings/profile-update-usecase.interface.js";
import { IUserChecksUsecase } from "./interfaces/auth/user-checks-usecase.interface.js";

export class ProfileImp implements IProfileUpdateUsecase {

    constructor(
        private UserRepository: IUserRepository,
        private UserChecksInstance: IUserChecksUsecase,
    ) {
    }

    async updateProfile(settings: ProfileSettingDTO, userId: string) {

        const userFound = await this.UserRepository.findUserById(userId);

        if (!userFound) throw new BadRequestError("User not found")
        else if (userFound.username !== settings.username) {
            throw new BadRequestError("Username donot match");
        }

        const updatedUser = await this.UserRepository.updateProfileDetails(settings);

        return updatedUser;
    };

    async updateUsername(newUsername: string, userId: string) {

        const user = await this.UserRepository.findUserById(userId, "+_id");

        if (user) {
            if (user.username === newUsername)
                throw new BadRequestError("you've entered the same username", 400);

            const taken = await this.UserChecksInstance.usernameExists(newUsername);

            if (taken) throw new ConflictError("Username exists");

            const updated = await this.UserRepository.updateUsername(user._id, newUsername);

            if (updated) return newUsername;
            else throw new InternalServerError("Failed to update usernmae");
        }

        throw new UnauthorizedError("User not found", 404);
    }
}