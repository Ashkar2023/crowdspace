import { SentMessageInfo } from "nodemailer";

export type MailType = "OTP" | "RESET_PASSWORD";

export interface IMailService {
    sendMail: (toMail: string, code: string, mailType: MailType, subject: string ) => Promise<SentMessageInfo>;
}