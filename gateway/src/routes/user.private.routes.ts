import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";

const userPrivateRoutes = Router();

userPrivateRoutes.all("/*",
    proxy<Request, Response>({
        target: process.env.USER_SERVICE,
        pathRewrite: { '/user': '' },
        logger: console,
    }),
)


export default userPrivateRoutes;