import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";

const adminPublicRoutes = Router();

adminPublicRoutes.post([
    '/admin/login',
],
    proxy<Request, Response>({
        target: process.env.USER_SERVICE,
        pathRewrite: { '/user': '' },
        logger: console,
    }),
);

export default adminPublicRoutes;