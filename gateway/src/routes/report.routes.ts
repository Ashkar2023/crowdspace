import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";


const reportRouter = Router();

reportRouter.all('/*',
    proxy<Request, Response>({
        target: process.env.CONTENT_SERVICE,
        logger: console,
        pathRewrite:(path, req)=>{
            return path.replace("/","/reports/");
        }
    })
)

export default reportRouter;