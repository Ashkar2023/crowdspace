import { IUserRepository } from "../repositories/user-repository.interface.js";

export interface IPasswordUpdateUsecase {
    updatePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<boolean>;
}