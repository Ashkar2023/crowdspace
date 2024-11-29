import cookieParser from "cookie-parser";
import express from "express";
import postRouter from "./routers/posts.router.js";
import { pingS3 } from "./services/s3.client.js";

/* Message Events setup */
import "./events/index.js"; // imports statically. Works before executing other code

const app = express();

app.use(express.json()); //accepts options
// app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/media", postRouter)

app.listen(process.env.PORT, () => {
    console.log("Media running at port: ", process.env.PORT);
});


await pingS3();