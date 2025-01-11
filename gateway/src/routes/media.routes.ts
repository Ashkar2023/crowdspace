import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { proxyDefaultConfig } from "../config/proxy.config.js";


const mediaRouter = Router();

mediaRouter.all('/*',
    proxy<Request, Response>({
        target: process.env.MEDIA_SERVICE,
        ...proxyDefaultConfig,
        pathRewrite:(path, req)=>{
            return path.replace("/","/media/");
        }
    })
)

export default mediaRouter;