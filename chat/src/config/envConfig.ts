import { validateEnv } from "@cr0wdspace/common"

interface IEnvConfig {
    NODE_ENV: "production" | 'development',
    CLIENT_URL: string
}

export const envConfig: IEnvConfig = {
    NODE_ENV: process.env.NODE_ENV === "production" ? "production" : "development",
    CLIENT_URL: process.env.CLIENT_URL!,
}

validateEnv(envConfig as unknown as { [key: string]: string }, "chat");