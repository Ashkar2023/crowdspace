import { CommentRepository } from "./comment.repository.js";
import { LikeRepository } from "./like.repository.js";
import PostRepository from "./post.repository.js";
import { ReportRepository } from "./report.repository.js";

export const PostRepoImp = new PostRepository();
export const CommentRepoImp = new CommentRepository();
export const LikeRepoImp = new LikeRepository();
export const ReportRepoImp = new ReportRepository();