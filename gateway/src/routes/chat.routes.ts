import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";

const chatRouter = Router();

chatRouter.all("/*",
    proxy<Request, Response>({
        target: process.env.CHAT_SERVICE,
        ...proxyDefaultConfig,
        pathRewrite: { "/": "/chats/" }
    })
)

export default chatRouter;