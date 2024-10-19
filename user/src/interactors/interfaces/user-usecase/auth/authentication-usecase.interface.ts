import { IUser } from "@entities/interfaces/user-entity.interface.js";

export type loginData = {
    credential: string,
    password: string,
    type: "email" | "username"
}

export interface IUserAuthenticationUsecase{
    authenticateUser: (loginData: loginData) => Promise<{
        user: IUser,
        accessToken: string,
        refreshToken: string
    }>;

    refreshAccessToken: (cookie: string) => Promise<string>;

}