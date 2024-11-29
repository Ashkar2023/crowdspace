import { CommentRepository } from "./comment.repository.js";
import { LikeRepository } from "./like.repository.js";
import PostRepository from "./post.repository.js";

export const PostRepoImp = new PostRepository();
export const CommentRepoImp = new CommentRepository();
export const LikeRepoImp = new LikeRepository();