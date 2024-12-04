import { createComment, deleteComment } from "@controllers/index.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

// prefixed with '/comments'

const commentRouter = Router();

commentRouter.post("/", createCallback(createComment));

commentRouter.delete("/:commentId", createCallback(deleteComment));

// edit

export default commentRouter;