import { deletePost } from "@controllers/index.js";
import { getFeed } from "@controllers/feed/getFeed.controller.js";
import { editPost } from "@controllers/post/editPost.controller.js";
import { getPostComments } from "@controllers/comment/getPostComments.controller.js";
import { likePost } from "@controllers/post/likePost.controller.js";
import { unlikePost } from "@controllers/post/unlikePost.controller.js";
import { createCallback } from "@cr0wdspace/common";
import { Router } from "express";
import { getPost } from "@controllers/post/getPost.controller.js";

/* /post */
export const postRouter = Router();

postRouter.get("/:postUrl", createCallback(getPost));

/* /posts */
const postsRouter = Router();

postsRouter.get("/:postId/comments", createCallback(getPostComments))

postsRouter.route("/:postId/like")
    .post(createCallback(likePost))
    .delete(createCallback(unlikePost))

postsRouter.route("/:postId")
    .delete(createCallback(deletePost))
    .patch(createCallback(editPost));

postsRouter.get("/", createCallback(getFeed))

export default postsRouter