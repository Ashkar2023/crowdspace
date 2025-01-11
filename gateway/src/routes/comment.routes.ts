import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";

const commentRouter = Router();


commentRouter.all("/*",
    proxy<Request,Response>({
        target:process.env.CONTENT_SERVICE,
        pathRewrite:{"/":"/comments/"},
        ...proxyDefaultConfig,
    })
)

export default commentRouter