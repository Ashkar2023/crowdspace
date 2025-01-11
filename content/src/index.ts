import cookieParser from "cookie-parser";
import express, { ErrorRequestHandler } from "express";
import { connect } from "mongoose";
import cors from "cors";

// Message Events setup
import "./events/index.js";
import "./events/consumer.js";

import { styleText } from "util";
import userContentRouter from "@routers/user-routes/user.routes.js";
import commentRouter from "@routers/user-routes/comment.routes.js";
import postRouter from "@routers/user-routes/post.routes.js";
import loggingMiddleware from "middlewares/logging.middleware.js";
import { globalErrorHadler, TokenError } from "@crowdspace/common";
import reportRouter from "@routers/user-routes/report.routes.js";
import { adminRouter } from "@routers/index.router.js";
import notificationRouter from "@routers/user-routes/notification.routes.js";

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

app.use("/admin", adminRouter)

app.use("/users", userContentRouter)

app.use("/comments", commentRouter);

app.use("/posts", postRouter);

app.use("/reports", reportRouter)

app.use("/notifications", notificationRouter);

app.listen(process.env.PORT, () => {
    console.log("Content service running at http://localhost:" + process.env.PORT);
})

app.use(globalErrorHadler);