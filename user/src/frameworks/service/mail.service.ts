import { IMailService } from "@interactors/interfaces/mailer-service.interface.js";
import { otpHtml } from "@src/config/mail-html.js";
import { createTransport, SentMessageInfo, Transporter, } from "nodemailer";

/* CHANGE to a seperate service */
export class Mailer implements IMailService { 
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PSWD,
            },
            pool: true
        })
        
        this.verifySmtp();
    }

    private verifySmtp() {
        this.transporter.verify(function (error, success) {
            if (error) {
                throw new Error("SMTP host connection error");
            } else {
                console.log("Server is ready to take our messages \n",
                    success
                ); //DELETE
            }
        });
    }

    async sendMail(toMail: string, otp: string) {
        const sentMailInfo: SentMessageInfo = await this.transporter.sendMail({
            to: toMail,
            from: process.env.SMTP_USER,
            subject: "OTP for Account Verification",
            html: otpHtml(otp)
        })

        return sentMailInfo;
    }

}