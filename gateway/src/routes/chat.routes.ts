import { Request, Response, Router } from "express";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";

const chatRouter = Router();

chatRouter.all("/*",
    proxy<Request,Response>({
        target:process.env.CHAT_SERVICE,
        logger:console,
        pathRewrite:{"/":"/chats"}
    })
)

export default chatRouter;