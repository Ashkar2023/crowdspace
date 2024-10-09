import { IUser } from "@entities/interfaces/user-entity.interface.js";

export interface IUserRegistrationUsecase{
    registerUser: (user: IUser) => Promise<Partial<IUser>>
}