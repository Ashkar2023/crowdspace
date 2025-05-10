import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { createCallback, decodeJWT, globalErrorHadler, JWTPayload } from "@cr0wdspace/common";
import mediaRouter from "./routes/media.routes.js";
import cookieParser from "cookie-parser";
import userAuthMiddleware from "./middlewares/authn.middleware.js";
import userPublicRoutes from "./routes/user.public.routes.js";
// import userPrivateRoutes from "./routes/users.routes.js";
import logMiddleware from "./middlewares/log.middleware.js";
import { refreshAccessToken } from "./controllers/token.refresh.js";
import profileRoutes from "./routes/profile.routes.js";
import commentRouter from "./routes/comment.routes.js";
import postsRouter, { postRouter } from "./routes/post.routes.js";
import reportRouter from "./routes/report.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import chatRouter from "./routes/chat.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { proxyDefaultConfig } from "./config/proxy.config.js";
import adminPublicRoutes from "./routes/admin.public.routes.js";
import expressacl from "express-acl";
import { envConfig } from "./config/env.config.js";

const app = express().disable("x-powered-by");

app.use(cors({
    origin: [
        envConfig.ADMIN_CLIENT,
        envConfig.USER_CLIENT
    ],
    allowedHeaders: ["Content-type", "X-user-id", "x-logged-in-username"],
    methods: 'GET,PUT,POST,PATCH,DELETE',
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    exposedHeaders: [],
}))

declare global {
    namespace Express {
        export interface Request {
            decoded?: JWTPayload
        }
    }
}

expressacl.config({
    decodedObjectName: "decoded",
    roleSearchPath: "decoded.role",
    filename: "racl.json",
    baseUrl: "/",
    denyCallback: (res,) => {

        return res!.status(403).json({
            error: "access_denied",
            success: false,
            message: 'You are not authorized to access this resource'
        });
    }
})

app.use(logMiddleware);

app.use("/user", userPublicRoutes); // For gateway /user -> /
app.use("/user", adminPublicRoutes); // For gateway /user -> /

app.use(cookieParser());


app.get("/auth/token-refresh", createCallback(refreshAccessToken));

app.use(userAuthMiddleware); //Calls to Auth service

app.use((req: Request, res: Response, next: NextFunction) => {

    if (req.cookies.ajwt) {
        const decoded = decodeJWT(req.cookies.ajwt);
        req.decoded = decoded;
    }

    next();
})

app.use(expressacl.authorize);

app.use("/users?", usersRoutes); // For interservices /users -> /users, For gateway /user -> /
app.use("/media", mediaRouter);

app.use("/comments", commentRouter);
app.use("/posts", postsRouter);
app.use("/post", postRouter)
app.use("/reports", reportRouter);
app.use("/admin", reportRouter);
app.use("/chats", chatRouter);
app.use("/notifications", notificationRouter)

app.use("/profile", profileRoutes); //aggregator route

app.use('/socket/chat', proxy({
    target: process.env.CHAT_SERVICE,
    ws: true,
    ...proxyDefaultConfig,
    pathRewrite: (path, req: Request) => {
        return req.originalUrl
    }
}))

app.get("/search", proxy({
    target: process.env.USER_SERVICE,
    ...proxyDefaultConfig,
    // do path rewrite if in seperate router
}));

/* Global Error Handler */
app.use(globalErrorHadler);

app.listen(process.env.PORT, () => {
    console.log('gateway running at port:', process.env.PORT);
})