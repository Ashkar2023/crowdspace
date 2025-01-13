import { model, Schema } from "mongoose";
import { ILike } from "~types/like.types.js";

const likeSchema = new Schema<ILike>({
    post_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'posts',
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});

likeSchema.index({ post_id: 1 })
likeSchema.index({ author: 1 })

export default model('like', likeSchema, "likes");
