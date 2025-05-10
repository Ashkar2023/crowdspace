import { IMailService, MailType } from "@interactors/interfaces/services/mailer-service.interface.js";
import { getMailContent } from "@src/config/mail-html.js";
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
        
        /* this.verifySmtp(); // Uncomment */
    }

    private verifySmtp() {
        this.transporter.verify(function (error, success) {
            if (error) {
                throw new Error("SMTP host connection error");
            } else {
                console.log("Server is ready to send email \n",
                    success
                ); //DELETE
            }
        });
    }

    async sendMail(toMail: string, code: string, type: MailType, subject: string) {
        const sentMailInfo: SentMessageInfo = await this.transporter.sendMail({
            to: toMail,
            from: process.env.SMTP_USER,
            subject: subject,
            html: getMailContent(type, code)
        })

        return sentMailInfo;
    }

}