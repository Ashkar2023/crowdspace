import { model, Schema } from "mongoose";
import { IComment } from "~types/comment.types.js";

const commentSchema = new Schema<IComment>({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    commentBody: {
        type: String,
        required: true,
        max: 500
    },
    replyFor: {
        type: Schema.Types.ObjectId,
        ref: 'comments',
        default: null
    },
});

export default model('comment', commentSchema, "comments");