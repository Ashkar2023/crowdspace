import { SentMessageInfo } from "nodemailer";

export interface IMailService {
    sendMail: (mail: string, otp: string) => Promise<SentMessageInfo>;
}