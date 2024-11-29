import cookieParser from "cookie-parser";
import express, { ErrorRequestHandler } from "express";
import { connect } from "mongoose";
import cors from "cors"

// Message Events setup
import "./events/index.js";
import "./events/post.consumer.js";
import { styleText } from "util";
import userContentRouter from "@routers/user.routes.js";
import commentRouter from "@routers/comment.routes.js";
import postRouter from "@routers/post.routes.js";
import loggingMiddleware from "middlewares/logging.middleware.js";
import { globalErrorHadler, TokenError } from "@crowdspace/common";
import { TokenErrorType } from "@crowdspace/common/dist/constants/token.error.js";
import reportRouter from "@routers/report.routes.js";

const app = express();

app.use(cors({
    // origin: [
    //     process.env.USER_CLIENT_DEV as string,
    //     process.env.USER_CLIENT_BUILD as string,
    //     process.env.USER_ADMIN as string,
    // ],
    origin: true,
    allowedHeaders: ["content-type"],
    methods: 'GET,PUT,POST,PATCH,DELETE',
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    exposedHeaders: [],
}))

app.use(express.json());

; (async function () {
    connect(process.env.DB_URL!)
        .then(result => {
            console.log(styleText('blueBright', "Content DB => Connected"));
        })
        .catch(error => {
            console.log(styleText('redBright', "Content DB => " + error.message));
        })
})();

app.use(loggingMiddleware)
app.use(cookieParser());

app.use("/users", userContentRouter)

app.use("/comments", commentRouter);

app.use("/posts", postRouter);

app.use("/reports",reportRouter)

app.listen(process.env.PORT, () => {
    console.log("Content service running at http://localhost:" + process.env.PORT);
})

const ErrorHandler: ErrorRequestHandler = (err: TokenError, req, res, next) => {
    console.log(err);
    res.status(err.statusCode).json({
        message: err.message,
        error: err.error,
        body: err.body,
        success:false
    })
    // next();
};
app.use(ErrorHandler);

// app.use(globalErrorHadler);