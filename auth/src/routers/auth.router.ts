import { generateAccessToken } from "@controllers/generate.access-token.js";
import { verifyAccessController } from "@controllers/verify.access-token.js";
import { createCallback, decodeJWT, JWTPayload } from "@cr0wdspace/common";
import { Router, Request, Response, NextFunction } from "express";
import expressacl from "express-acl";
import { verifyRefreshToken } from "middlewares/verify.refresh-token.js";

const authRouter = Router();

authRouter.get('/verify-access', createCallback(verifyAccessController));

authRouter.get('/token-refresh',
    verifyRefreshToken,
    createCallback(generateAccessToken)
);

// /login-tokens generate tokens

export default authRouter