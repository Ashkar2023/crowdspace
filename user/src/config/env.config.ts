interface IEnvConfig {
    REDIS_URL: string,
    NODE_ENV: "production" | "development",
    FRONTEND_URL: string,
    TOKEN_SECRET: string,
    RESET_TOKEN_SECRET: string,
    ISSUER: string,
    AUDIENCE: string
}

export const envConfig: IEnvConfig = {
    REDIS_URL: process.env.REDIS_URL!,
    NODE_ENV: process.env.NODE_ENV === "production" ? "production" : "development",
    FRONTEND_URL: process.env.FRONTEND_URL!,
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET!,
    TOKEN_SECRET: process.env.TOKEN_SECRET!,
    ISSUER: process.env.ISSUER!,
    AUDIENCE: process.env.AUDIENCE!
}