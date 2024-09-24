import { IUser } from "@entities/interfaces/user-entity.interface.js";


export interface IAuthUsecases {
    registerUser: (user: IUser) => Promise<Partial<IUser>>
    checkExistingUser: (email: string) => Promise<boolean>;
    // loginUser : ()=> Promise<IUser>
}

export interface IUserUsecases {
    usernameExists: (username: string) => Promise<boolean>,
}