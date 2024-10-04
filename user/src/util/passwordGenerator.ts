export default function generateRandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const minLength = 8;
    const maxLength = Math.floor(Math.random() * 8) + minLength; // Random length between 8 and 16

    let password = "";

    for (let i = 0; i < maxLength; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    return password;
}

