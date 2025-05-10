import { DatabaseOpError } from "@cr0wdspace/common";
import commentModel from "models/comment.model.js";
import { DeleteOneModel, DeleteResult, HydratedDocument, Model, Types } from "mongoose";
import { IComment } from "~types/comment.types.js";

export class CommentRepository {
    #model: Model<IComment> = commentModel;

    constructor() { }

    async createComment({
        commentBody,
        post_id,
        replyFor,
        author,
    }: IComment): Promise<HydratedDocument<IComment>> {

        const result = await this.#model.create({
            post_id, //should be postUUID in future
            author,
            commentBody,
            replyFor,
        });

        return result

    }

    async editComment({
        commentId,
        commentBody,
        author
    }: {
        commentId: string,
        commentBody: string,
        author: string
    }): Promise<HydratedDocument<IComment> | null> {
        return await this.#model.findOneAndUpdate(
            {
                _id: commentId,
                author
            },
            {
                $set: {
                    commentBody,
                    edited: true
                }
            },
            {
                new: true
            }
        )
    }

    async deleteComment(commentId: string): Promise<HydratedDocument<IComment> | null> {
        return await this.#model.findByIdAndDelete(commentId);
    }

    async getPostComments(postId: string): Promise<HydratedDocument<IComment>[]> {
        return await this.#model.find({ post_id: postId }).populate("author");
    }

    async findComment(commentId: string) {
        return await this.#model.findById(commentId);
    }
}