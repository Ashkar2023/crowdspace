import { globalErrorHadler } from "@crowdspace/common";
import authRouter from "@routers/auth.router.js";
import cookieParser from "cookie-parser";
import express from "express";
import loggingMiddleware from "middlewares/logging.middleware.js";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    (rq,rs,n)=>{console.log(rq.path),n()},
)

app.use(loggingMiddleware)
app.use("/auth", authRouter)

app.listen(process.env.PORT, () => {
    console.log("Auth service running at http://localhost:"+process.env.PORT);
})



app.use(globalErrorHadler);