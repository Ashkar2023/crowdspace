import { getUserPosts } from "@controllers/index.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

const userContentRouter = Router();

// prefixed with '/users'

userContentRouter.get("/:user_id/posts",createCallback(getUserPosts));

export default userContentRouter