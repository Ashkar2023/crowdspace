import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";

const userPrivateRoutes = Router();

userPrivateRoutes.all("/*",
    proxy<Request, Response>({
        target: process.env.USER_SERVICE,
        pathRewrite: { '/user': '' },
        ...proxyDefaultConfig
    }),
)


export default userPrivateRoutes;