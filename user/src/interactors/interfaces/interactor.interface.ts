import { IUser } from "@entities/interfaces/user-entity.interface.js";

export type loginData = {
    credential: string,
    password: string,
    type: "email" | "username" | "_id"
}

export interface IAuthUsecases {
    registerUser: (user: IUser) => Promise<Partial<IUser>>
    checkExistingUser: (email: string) => Promise<boolean>;
    authenticateUser: (loginData: loginData) => Promise<{
        user: IUser,
        accessToken: string,
        refreshToken: string
    }>
}

export interface IUserUsecases {
    usernameExists: (username: string) => Promise<boolean>,
}