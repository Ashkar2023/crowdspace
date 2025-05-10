import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";

const userPublicRoutes = Router();

userPublicRoutes.all([
    '/auth/login',
    '/auth/create',
    '/auth/register',
    '/auth/check-username',
    '/auth/oauth-callback',
    '/auth/gen-otp',
    '/auth/verify-otp',
    '/settings/reset-password',
],
    proxy<Request, Response>({
        target: process.env.USER_SERVICE,
        pathRewrite: { '/user': '' },
        logger: console,
    }),
);

export default userPublicRoutes;