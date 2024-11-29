import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";

const commentRouter = Router();


commentRouter.all("/*",
    proxy<Request,Response>({
        target:process.env.CONTENT_SERVICE,
        logger:console,
        pathRewrite:{"/":"/comments/"},
        headers:{
            "Cache-Control":"no-store"
        }
    })
)

export default commentRouter