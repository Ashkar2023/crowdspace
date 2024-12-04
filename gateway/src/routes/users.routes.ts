import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";

const usersRoutes = Router();

usersRoutes.all("/*",
    proxy<Request, Response>({
        target: process.env.USER_SERVICE,
        pathRewrite: { '/': '/users/' },
        logger: console,
        on: {
            proxyReq(proxyReq, req, res) {
                console.log("header",req.headers["x-logged-in-user"]);
                proxyReq.setHeader("x-logged-in-user", req.headers["x-logged-in-user"] as string);
            }
        }
    }),
)


export default usersRoutes;