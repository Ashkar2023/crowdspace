import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";

const postRouter =  Router();

postRouter.all("/*",
    proxy<Request, Response>({
        target:process.env.CONTENT_SERVICE,
        logger:console,
        pathRewrite:{"^/":"/posts/"}
    })
)

export default postRouter;