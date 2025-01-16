import { envConfig } from "config/envConfig.js";
import { styleText } from "node:util";
import { createClient, RedisClientType } from "redis";

export class RedisService {
    private static instance: RedisService;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient({
            url: envConfig.REDIS_URL
        });

        this.client.on("error", async (err) => {
            console.log(
                styleText("redBright", "Redis Error : " + err.code + "\n"),
                styleText("italic", "Learn to handle connnection error and refactor\n")
            );

            await this.client.disconnect();
        })
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public async connect(): Promise<RedisClientType> {
        console.log(styleText("bgGreen", "REDIS server connected"));
        return await this.client.connect();
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}
