import { globalErrorHadler } from "@crowdspace/common";
import { connectDb } from "@frameworks/db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import { createWriteStream } from "node:fs";
import { truncate, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { adminAuthRouter, adminUserRouter, authRouter, settingsRouter } from "./routes/index.js";

const app = express().disable("x-powered-by");
connectDb(process.env.DB_URL as string);


app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5111"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    exposedHeaders: []
}))

declare module "express-session" {
    interface SessionData {
        user: string
    }
}

app.use(session({ /* CHANGE TO REDIS */
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 10
    }
}))

// const __filename = fileURLToPath(import.meta.url);
// const accessLogPath = resolve(dirname(__filename), "../../../access.log");

// await truncate(accessLogPath);
// await writeFile(accessLogPath,"\n");
// const accessLogStream = createWriteStream(accessLogPath, { flags: "a" })

// app.use(morgan("dev", { stream: accessLogStream }))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//user routes
app.use("/auth", authRouter); // when changing to NGINX check the prefix route path ex: /auth 
app.use("/settings", settingsRouter)

//admin routes
app.use("/admin", adminAuthRouter)
app.use("/admin", adminUserRouter)


/* global error handling */
app.use(globalErrorHadler); // enhance the global error handler later


export default app;