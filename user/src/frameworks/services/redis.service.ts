import { envConfig } from "@src/config/env.config.js";
import { styleText } from "node:util";
import { createClient, RedisClientType } from "redis";
import { UserRepositoryImp } from "@frameworks/db/repository/user.repository.js";
import { userModel } from "@frameworks/db/models/user.model.js";

/* 👇FIX anti patternn, inject these */

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

    public async storeBannedUsers(): Promise<number> {
        const userRepoImp = new UserRepositoryImp(userModel);
        const bannedUsers = await userRepoImp.getAllBannedUsers();

        if (bannedUsers.length > 0){
            const added = await this.client.SADD("bannedUsers", bannedUsers);
            return added;
        }

        return 0
    }
}
