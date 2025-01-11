import { IUser } from "@entities/interfaces/user-entity.interface.js";

export type loginData = {
    credential: string,
    password: string,
    type: "email" | "username"
}

export interface IAuthUseCase {
    login(loginData: loginData): Promise<{
        admin: IUser,
        access_token: string,
        refresh_token: string,
    }>;
    // logout(userId: string): Promise<void>;
    // refreshToken(token: string): Promise<string>;
    // resetPassword(email: string): Promise<void>;
}