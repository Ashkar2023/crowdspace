import { getPostComments } from "@controllers/post/getPostComments.controller.js";
import { likePost } from "@controllers/post/likePost.controller.js";
import { unlikePost } from "@controllers/post/unlikePost.controller.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

const postRouter = Router();

// prefixed with '/posts'

postRouter.get("/:postId/comments",createCallback(getPostComments))

postRouter.post("/:postId/like",createCallback(likePost))

postRouter.delete("/:postId/like",createCallback(unlikePost))

export default postRouter