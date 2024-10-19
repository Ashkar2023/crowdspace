import { BadRequestError } from "@crowdspace/common";
import { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import { IPasswordUpdateUsecase } from "../interfaces/user-usecase/settings/password-update-usecase.interface.js";
import { IHashService } from "../interfaces/services/hash-service.interface.js";

export class PasswordUpdateImp implements IPasswordUpdateUsecase {

    constructor(
        private _UserRepository: IUserRepository,
        private _HashService: IHashService
    ) {
        
    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string) {

        const user = await this._UserRepository.findUserById(userId, "+password");

        if (!user) {
            throw new BadRequestError("Couldn't find User");
        } else {
            const conflict = await this._HashService.comparePassword(newPassword, user.password);
            if (conflict)
                throw new BadRequestError("New password conflicts with old password");
        }

        const isSame = await this._HashService.comparePassword(oldPassword, user.password);

        if (isSame) {
            const encryptedPwd = await this._HashService.hashPassword(newPassword);
            await this._UserRepository.updatePassword(user.email, encryptedPwd);

        } else {
            throw new BadRequestError("Incorrect old password");
        }

        return true
    };


}