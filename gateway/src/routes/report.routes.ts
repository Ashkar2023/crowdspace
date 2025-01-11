import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";


const reportRouter = Router();

reportRouter.all('/*',
    proxy<Request, Response>({
        target: process.env.CONTENT_SERVICE,
        ...proxyDefaultConfig,
        pathRewrite: (path, req) => {

            return req.baseUrl === "/admin" ?
                path.replace("/", "/admin/") :
                path.replace("/", "/reports/");
        }
    })
)

export default reportRouter;