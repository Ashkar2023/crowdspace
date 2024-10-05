import { IUser } from "@entities/interfaces/user-entity.interface.js";

export interface IUserRegistrationUsecase{
    registerUser: (user: IUser) => Promise<Partial<IUser>>
    
    checkExistingUser: (email: string) => Promise<boolean>;
    
    usernameExists: (username: string) => Promise<boolean>,
}