import { globalErrorHadler } from "@crowdspace/common";
import { connectDb } from "@frameworks/db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authRouter } from "./routes/index.js";


const app = express();
connectDb(process.env.DB_URL as string);


app.use(cors({
    origin: ["http://localhost:5173"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    // exposedHeaders:[]
}))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/auth", authRouter); // when changing to NGINX check the prefix route path ex: /auth 


/* global error handling */
app.use(globalErrorHadler); // enhance the global error handler later


export default app;




