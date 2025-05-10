import { IUserRepository } from "../../repositories/user-repository.interface.js";

export interface IPasswordUpdateUsecase {
    updatePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<boolean>;
    resetForgottenPassword: (email: string, newPassword: string) => Promise<boolean | never>
    generateAndEmailResetLink: (email: string)=> Promise<boolean>
}