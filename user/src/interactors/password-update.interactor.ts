import { BadRequestError } from "@crowdspace/common";
import { IUserRepository } from "./interfaces/repositories/user-repository.interface.js";
import { IPasswordUpdateUsecase } from "./interfaces/settings/password-update-usecase.interface.js";
import { IHashService } from "./interfaces/services/hash-service.interface.js";

export class PasswordUpdateImp implements IPasswordUpdateUsecase {

    constructor(
        private UserRepository: IUserRepository,
        private HashService: IHashService
    ) {

    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await this.UserRepository.findUserById(userId, "+password");
        console.log(user);


        if (!user) {
            throw new BadRequestError("Couldn't find User");
        } else {
            const conflict = await this.HashService.comparePassword(newPassword, user.password);
            if (conflict)
                throw new BadRequestError("New password conflicts with old password");
        }

        const isSame = await this.HashService.comparePassword(oldPassword, user.password);

        if (!isSame) {
            throw new BadRequestError("Incorrect old password");
        } else {
            const encryptedPwd = await this.HashService.hashPassword(newPassword);

            try {
                await this.UserRepository.updatePassword(user.email, encryptedPwd);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        }

        return true
    };


}