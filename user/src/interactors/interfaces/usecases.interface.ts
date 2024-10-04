import { IOtp } from "@entities/interfaces/otp-entity.interface.js";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { HydratedDocument } from "mongoose";

export type loginData = {
    credential: string,
    password: string,
    type: "email" | "username" | "_id"
}

export interface IAuthUsecases {
    checkExistingUser: (email: string) => Promise<boolean>;

    registerUser: (user: IUser) => Promise<Partial<IUser>>

    /* authenticates user and creates jwt tokens(refresh, access) */
    authenticateUser: (loginData: loginData) => Promise<{
        user: IUser,
        accessToken: string,
        refreshToken: string
    }>;


    // googleAuthExistingUser: (email: string) => Promise<void>;
    // googleAuthNewUser: (email: string) => Promise<void>;

    genAndSendOtpMail: (email: string) => Promise<Partial<IOtp>>;
    verifyOtp: (email: string, otp: string) => Promise<HydratedDocument<IUser> | false>;

    refreshAccessToken: (cookie: string) => Promise<string>;
}


//seperate these files
export interface IUserUsecases {
    usernameExists: (username: string) => Promise<boolean>,
}