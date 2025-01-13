import likeModel from "models/like.model.js";
import { HydratedDocument, Model, ModifyResult, Types } from "mongoose";
import { ILike } from "~types/like.types.js";

export class LikeRepository {
    #model: Model<ILike> = likeModel;

    constructor() { }

    async createLikeIfNotExists({
        author, post_id
    }: ILike): Promise<ModifyResult<ILike> | null> { //ModifyResult is for giving out {metadata & doc(as value)} from findOneAndUpdate operation

        const result = await this.#model.findOneAndUpdate(
            {
                author,
                post_id
            },
            {
                $setOnInsert: {
                    author,
                    post_id
                },
            },
            {
                upsert: true,
                includeResultMetadata: true,
                new: true
            });

        return result
    }

    async deleteLike({ post_id, author }: Record<string, Types.ObjectId>): Promise<HydratedDocument<ILike> | null> {
        return await this.#model.findOneAndDelete({ post_id, author });
    }

    /* QUERY all like in descending sort */

    async findLikes(postIds: Types.ObjectId[]): Promise<HydratedDocument<ILike>[]> {
        return this.#model.find({ post_id: { $in: postIds } });
    }

}