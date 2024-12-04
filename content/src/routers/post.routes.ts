import { deletePost } from "@controllers/post/deletePost.controller.js";
import { getPostComments } from "@controllers/post/getPostComments.controller.js";
import { likePost } from "@controllers/post/likePost.controller.js";
import { unlikePost } from "@controllers/post/unlikePost.controller.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

// prefixed with '/posts'

const postRouter = Router();

postRouter.get("/:postId/comments",createCallback(getPostComments))

postRouter.post("/:postId/like",createCallback(likePost))

postRouter.delete("/:postId/like",createCallback(unlikePost))

postRouter.delete("/:postId",createCallback(deletePost))

export default postRouter