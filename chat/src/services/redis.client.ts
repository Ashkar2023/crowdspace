import { createClient } from "redis";
import { styleText } from "util";

const redisClient = createClient({
    url: process.env.REDIS_URL,

});

redisClient.on("error", async (err) => {
    console.log(
        styleText("redBright", "Redis Error : " + err.code + "\n"),
        styleText("italic","Learn to handle connnection error and refactor\n")
    );

    await redisClient.disconnect();
})

export async function connectRedis() {
    const connection = await redisClient.connect();
    console.log("REDIS server connected");
    
    return connection;
}

export default redisClient;