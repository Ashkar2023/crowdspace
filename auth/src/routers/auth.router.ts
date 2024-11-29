import { generateAccessToken } from "@controllers/generate.access-token.js";
import { verifyAccessController } from "@controllers/verify.access-token.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";
import { verifyRefreshToken } from "middlewares/verify.refresh-token.js";

const authRouter = Router();

authRouter.get('/verify-access', createCallback(verifyAccessController));

authRouter.get('/token-refresh',
    verifyRefreshToken,
    createCallback(generateAccessToken)
);

export default authRouter