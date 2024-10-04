export const otpHtml = (otp: string) => (
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP for Crowdspace</title>
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
        .footer {
            text-align: center;
            color: #71717a;
            font-size: 14px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify Your Account</h1>
        <p>Your OTP is:</p>
        <div class="otp-container">
            <span class="otp">${otp}</span>
        </div>
        <p>This OTP will expire in 3 minutes.</p>
        <p class="footer">&copy; 2024 Crowdspace</p>
    </div>
</body>
</html>`
)