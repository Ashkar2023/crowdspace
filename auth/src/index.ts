import { globalErrorHadler } from "@cr0wdspace/common";
import authRouter from "@routers/auth.router.js";
import cookieParser from "cookie-parser";
import express from "express";
import loggingMiddleware from "middlewares/logging.middleware.js";
import { RedisService } from "services/redis.client.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

const redisImp = RedisService.getInstance();
await redisImp.connect();

app.use(
    (rq, rs, n) => { console.log(rq.path), n() },
)

app.use(loggingMiddleware)
app.use("/auth", authRouter)

app.listen(process.env.PORT, () => {
    console.log("Auth service running at http://localhost:" + process.env.PORT);
})



app.use(globalErrorHadler);