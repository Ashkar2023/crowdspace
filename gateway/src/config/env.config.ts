import { validateEnv } from "@cr0wdspace/common"

interface IEnvConfig {
    NODE_ENV: "production" | 'development',
    USER_CLIENT: string,
    ADMIN_CLIENT: string
    CONTENT_SERVICE: string
    USER_SERVICE: string
}

export const envConfig: IEnvConfig = {
    NODE_ENV: process.env.NODE_ENV === "production" ? "production" : "development",
    ADMIN_CLIENT: process.env.ADMIN_CLIENT!,
    USER_CLIENT: process.env.USER_CLIENT!,
    USER_SERVICE: process.env.USER_SERVICE!,
    CONTENT_SERVICE: process.env.CONTENT_SERVICE!,
}

validateEnv(envConfig as unknown as { [key: string]: string }, "gateway");