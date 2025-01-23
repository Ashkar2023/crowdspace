import { generateAccessToken } from "@controllers/generate.access-token.js";
import { verifyAccessController } from "@controllers/verify.access-token.js";
import { createCallback } from "@cr0wdspace/common";
import { Router } from "express";
import { verifyRefreshToken } from "middlewares/verify.refresh-token.js";

const authRouter = Router();

authRouter.get('/verify-access', createCallback(verifyAccessController));

authRouter.get('/token-refresh',
    verifyRefreshToken,
    createCallback(generateAccessToken)
);

// /login-tokens generate tokens

export default authRouter