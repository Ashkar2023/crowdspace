interface IEnvConfig {
    REDIS_URL: string,
    NODE_ENV: "development" | "production"
}

export const envConfig : IEnvConfig = {
    REDIS_URL: process.env.REDIS_URL!,
    NODE_ENV: process.env.NODE_ENV === "production" ? "production" : "development",
}