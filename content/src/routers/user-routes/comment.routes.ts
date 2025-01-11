import { createComment, deleteComment } from "@controllers/index.js";
import { editComment } from "@controllers/comment/editComment.controller.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

// prefixed with '/comments'

const commentRouter = Router();

commentRouter.post("/", createCallback(createComment));

commentRouter.route("/:commentId")
    .delete(createCallback(deleteComment))
    .patch(createCallback(editComment));

export default commentRouter;