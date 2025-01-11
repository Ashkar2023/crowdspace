import { deletePost } from "@controllers/index.js";
import { getFeed } from "@controllers/feed/getFeed.controller.js";
import { editPost } from "@controllers/post/editPost.controller.js";
import { getPostComments } from "@controllers/comment/getPostComments.controller.js";
import { likePost } from "@controllers/post/likePost.controller.js";
import { unlikePost } from "@controllers/post/unlikePost.controller.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

// prefixed with '/posts'

const postRouter = Router();

postRouter.get("/:postId/comments", createCallback(getPostComments))

postRouter.route("/:postId/like")
    .post(createCallback(likePost))
    .delete(createCallback(unlikePost))

postRouter.route("/:postId")
    .delete(createCallback(deletePost))
    .patch(createCallback(editPost));

postRouter.get("/", createCallback(getFeed))

export default postRouter