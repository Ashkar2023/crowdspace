import express from "express";
import cors from "cors";

import { createCallback, globalErrorHadler } from "@crowdspace/common";
import mediaRouter from "./routes/media.routes.js";
import cookieParser from "cookie-parser";
import userAuthMiddleware from "./middlewares/authn.middleware.js";
import userPublicRoutes from "./routes/user.public.routes.js";
import userPrivateRoutes from "./routes/users.routes.js";
import logMiddleware from "./middlewares/log.middleware.js";
import { refreshAccessToken } from "./controllers/token.refresh.js";
import profileRoutes from "./routes/profile.routes.js";
import commentRouter from "./routes/comment.routes.js";
import postRouter from "./routes/post.routes.js";
import reportRouter from "./routes/report.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import chatRouter from "./routes/chat.routes.js";

const app = express().disable("x-powered-by");

app.use(cors({
    // origin: [
    //     process.env.USER_CLIENT_DEV as string,
    //     process.env.USER_CLIENT_BUILD as string,
    //     process.env.USER_ADMIN as string,
    // ],
    origin: true,
    allowedHeaders: ["Content-type", "X-user-id", "x-logged-in-username"],
    methods: 'GET,PUT,POST,PATCH,DELETE',
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    exposedHeaders: [],
}))


app.use(logMiddleware);

// User routes
app.use("/user", userPublicRoutes);

app.use(cookieParser());

app.get("/auth/token-refresh", createCallback(refreshAccessToken));

app.use(userAuthMiddleware); //Calls to Auth service

app.use("/user", userPrivateRoutes);
app.use("/users", usersRoutes)
app.use("/media", mediaRouter);
app.use("/profile", profileRoutes);
app.use("/comments", commentRouter);
app.use("/posts", postRouter);
app.use("/reports", reportRouter);
app.use("/chats",chatRouter)

// socket connections
app.use('/socket/chat', createProxyMiddleware({
    target: process.env.CHAT_SERVICE,
    ws: true,
    logger: console,
    on: {
        
    }
}))


/* Global Error Handler */
app.use(globalErrorHadler);

app.listen(process.env.PORT, () => {
    console.log('gateway running at port:', process.env.PORT);
})