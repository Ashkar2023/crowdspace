import express from "express";
import { connectDb } from "@frameworks/db/mongo/db.js";
import cookieParser from "cookie-parser"
import { authRouter, userRouter } from "./routes/index.js";
import { globalErrorHadler } from "@crowdspace/common";
import cors from "cors"


const ENVIRONMENT = process.env.NODE_ENV

if (ENVIRONMENT === "dev") {
    process.loadEnvFile(`./.${ENVIRONMENT}.env`);
}


const app = express();
connectDb(process.env.DB_URL as string);


app.use(cors({
    origin: ["http://localhost:5173"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    maxAge: 20,
    preflightContinue: false,
    // exposedHeaders:[]
}))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/auth", authRouter); // when changing to NGINX check the prefix route path ex: /auth 
app.use("/", userRouter);


/* global error handling */
app.use(globalErrorHadler); // enhance the global error handler later


export default app;




