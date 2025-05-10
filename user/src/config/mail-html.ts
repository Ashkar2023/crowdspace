import { MailType } from "@interactors/interfaces/services/mailer-service.interface.js";

const emailTemplate = (content: string, title: string) => (
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #18181b;
            margin-bottom: 20px;
        }
        p {
            text-align: center;
            color: #52525b;
            margin-bottom: 30px;
        }
        .footer {
            text-align: center;
            color: #71717a;
            font-size: 14px;
            margin-top: 30px;
        }
        .otp-container {
            background-color: #f4f4f5;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
            margin-bottom: 30px;
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #18181b;
        }
        .btn {
            display: block;
            width: 100%;
            text-align: center;
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
        <p class="footer">&copy; 2025 Crowdspace</p>
    </div>
</body>
</html>`
);

export const getOtpHtml = (otp: string) => emailTemplate(
    `<h1>Verify Your Account</h1>
    <p>Your OTP is:</p>
    <div class="otp-container">
        <span class="otp">${otp}</span>
    </div>
    <p>This OTP will expire in 5 minutes.</p>`,
    "Your OTP for Crowdspace"
);

export const forgotPasswordLinkHtml = (link: string) => emailTemplate(
    `<h1>Reset Your Password</h1>
    <p>Click the button below to reset your password:</p>
    <a href="${link}" class="btn">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>`,
    "Reset Your Password - Crowdspace"
);

export const getMailContent = (mailType: MailType, ...args: string[]) => {
    switch (mailType) {
        case "RESET_PASSWORD":
            return forgotPasswordLinkHtml(args[0]);
        case "OTP":
            return getOtpHtml(args[0]);
    }
}