import { envConfig } from "config/envConfig.js";
import { styleText } from "node:util";
import { createClient, RedisClientType } from "redis";

export class RedisService {
    private static instance: RedisService;
    private client: RedisClientType;
    #retries: number = 0;
    #maxRetries: number = 2;
    #interval: number = 5000;

    private constructor() {
        this.client = createClient({
            url: envConfig.REDIS_URL,
            socket: {
                reconnectStrategy: false
            }
        });

        this.client.on("error", async (err) => {
            console.log(styleText("redBright", "Redis Error : " + err.code + "\n"));

            envConfig.NODE_ENV === "development" &&
                console.log(styleText("italic", "Learn to handle connnection error and refactor\n"));

            if (this.#retries < this.#maxRetries) {
                ++this.#retries;
                console.log(styleText("yellow", `Retrying connection (${this.#retries}/${this.#maxRetries})...\n @${new Date().toLocaleTimeString()}`));

                setTimeout(() => {
                    console.log(this.#retries, "@", new Date().toLocaleTimeString())
                    this.connect();
                }, 5000)

                return
            }

            console.log(styleText("redBright", "Max retries reached. Could not connect to Redis.\n"));
            // throw err;
        })
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    /** 
     * The connect throws an error so the onError should be used according to that
    */
    // @ts-ignore
    public async connect(): Promise<RedisClientType | never> {
        try{
            return await this.client.connect();
        }catch(error){
            console.log("============")
            // @ts-ignore
            console.log((error as Error).code)
            console.log("============")
            // throw error
        }
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}
