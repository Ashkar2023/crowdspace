import express from "express";
import { connect } from "mongoose";

// Message Events setup
import "./events/index.js";
import "./events/consumer.js";

import { styleText } from "util";
import userContentRouter from "@routers/user-routes/user.routes.js";
import commentRouter from "@routers/user-routes/comment.routes.js";
import postsRouter, { postRouter } from "@routers/user-routes/post.routers.js";
import loggingMiddleware from "middlewares/logging.middleware.js";
import { globalErrorHadler, TokenError } from "@cr0wdspace/common";
import reportRouter from "@routers/user-routes/report.routes.js";
import { adminRouter } from "@routers/index.router.js";
import notificationRouter from "@routers/user-routes/notification.routes.js";

const app = express();

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

app.use("/admin", adminRouter)

app.use("/users", userContentRouter)

app.use("/comments", commentRouter);

app.use("/posts", postsRouter);
app.use("/post", postRouter);

app.use("/reports", reportRouter)

app.use("/notifications", notificationRouter);

app.listen(process.env.PORT, () => {
    console.log("Content service running at http://localhost:" + process.env.PORT);
})

app.use(globalErrorHadler);