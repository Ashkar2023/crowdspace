import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";


const notificationRouter = Router();

notificationRouter.all('/*',
    proxy<Request, Response>({
        target: process.env.CONTENT_SERVICE, // is where notifications are handled
        ...proxyDefaultConfig,
        pathRewrite: (path, req) => {
            return path.replace("/", "/notifications/");
        }
    })
)

export default notificationRouter;