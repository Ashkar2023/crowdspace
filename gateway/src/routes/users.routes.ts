import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";

const usersRoutes = Router();

usersRoutes.all("/*",
    proxy<Request, Response>({
        target: process.env.USER_SERVICE,
        pathRewrite: { '/': '' },
        ...proxyDefaultConfig,
        on: {
            proxyReq(proxyReq, req, res) {
                console.log("header",req.headers["x-logged-in-user"]);
                proxyReq.setHeader("x-logged-in-user", req.headers["x-logged-in-user"] as string);
            }
        }
    }),
)


export default usersRoutes;