import { model, Schema } from "mongoose";
import { ILike } from "~types/like.types.js";

const likeSchema = new Schema<ILike>({
    post_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'posts',
    },
    author:{
        type:Schema.Types.ObjectId,
        required:true,
    }
});


export default model('like', likeSchema, "likes");
