import { getUserPosts } from "@controllers/index.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

// prefixed with '/users'

const userContentRouter = Router();

userContentRouter.get("/:user_id/posts",createCallback(getUserPosts));

export default userContentRouter