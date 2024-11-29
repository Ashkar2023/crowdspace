import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";


const mediaRouter = Router();

mediaRouter.post('/*',
    proxy<Request, Response>({
        target: process.env.MEDIA_SERVICE,
        logger: console,
        pathRewrite:(path, req)=>{
            return path.replace("/","/media/");
        }
    })
)

export default mediaRouter;