import { globalErrorHadler } from "@cr0wdspace/common";
import { connectDb } from "@frameworks/db/db.js";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import { adminAuthRouter, adminUserRouter, authRouter, settingsRouter, userRouter } from "./routes/index.js";
import logMiddleware from "./middlewares/log.middleware.js";

const app = express().disable("x-powered-by");
connectDb(process.env.DB_URL as string);

import "@frameworks/services/events/events.service.js";
import "@frameworks/services/events/consumer.js";
import { RedisService } from "@frameworks/services/redis.service.js";

const redisImp = RedisService.getInstance()
await redisImp.connect();
await redisImp.storeBannedUsers();

// declare module "express-session" { // For session logins for admins
//     interface SessionData {
//         user: string
//     }
// }

// app.use(session({ /* CHANGE TO REDIS */
//     secret: process.env.SESSION_SECRET as string,
//     saveUninitialized: false,
//     resave: false,
//     rolling: true,
//     cookie: {
//         httpOnly: true,
//         maxAge: 1000 * 60 * 10
//     }
// }))

app.use(logMiddleware);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//user routes
app.use("/auth", authRouter); 
app.use("/settings", settingsRouter)

//admin routes
app.use("/admin", adminAuthRouter)
app.use("/admin", adminUserRouter)
app.use([
    "/profile",
    "/"
], userRouter);

/* global error handling */
app.use(globalErrorHadler); // enhance the global error handler later

export default app;