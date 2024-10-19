import { IOtp } from "@entities/interfaces/otp-entity.interface.js";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { HydratedDocument } from "mongoose";

export interface IOtpUsecase {
    genAndSendOtpMail: (email: string) => Promise<Partial<IOtp>>; // this is not closely related i think
    
    verifyOtp: (email: string, otp: string) => Promise<HydratedDocument<IUser> | false>;
}