import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";

const postsRouter =  Router();
export const postRouter =  Router();

postsRouter.all("/*",
    proxy<Request, Response>({
        target:process.env.CONTENT_SERVICE,
        pathRewrite:{"^/":"/posts/"},
        ...proxyDefaultConfig,
    })
)

postRouter.all("/*",
    proxy<Request, Response>({
        target:process.env.CONTENT_SERVICE,
        pathRewrite:{"^/":"/post/"},
        ...proxyDefaultConfig,
    })
)

export default postsRouter;