import { model, Schema, SchemaTypes } from "mongoose";
import { MediaEnum, PostEnum, PostStatus, Media, T_Post, PostVisibilty } from "~types/post.types.js";
import { pointSchema } from "./common.schemas.js";
import { generateUrlSafeHash } from "@cr0wdspace/common";

const mediaSchema = new Schema<Media>({
    // index: Number,
    media_meta: SchemaTypes.Mixed,
    media_url: String,
    mediaType: {
        type: String,
        enum: Object.values(MediaEnum),
        required: true
    },
}, { _id: false })


const postSchema = new Schema<T_Post>({
    author: {
        type: SchemaTypes.ObjectId,
        required: true
    },
    caption: {
        type: String,
        required: false,
        maxlength: 2000
    },
    url: {
        type: String,
        required: true,
        default: function () {
           return generateUrlSafeHash(this.author.toString(), Date.now().toString())
        }
    },
    tags: {
        type: [String],
        default: [],
        validate: { //hint: return false = error, true = continue
            validator: function (t: string[]) { return t.length < 20 }, // Make this validation into bussiness logic
            message: "Max 20 post tags"
        }
    },
    thumbnail: String,
    postType: {
        type: String,
        enum: Object.values(PostEnum),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(PostStatus),
        required: true,
        default: PostStatus.ACTIVE
    },
    mentions: {
        type: [SchemaTypes.ObjectId],
        required: false,
    },
    media: { // THIS field can be written as {any : [{}]}
        type: [mediaSchema],
        default: undefined,
    },
    visibility: {
        type: String,
        enum: Object.values(PostVisibilty),
        required: true
    },
    archived: {
        type: Boolean,
        required: true,
        default: false,
    },
    location: {
        type: pointSchema,
        required: false,
    },
    commentsCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    likesCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    shareCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    viewsCount: {
        type: Number,
        default: 0,
        required: true
    }

}, { timestamps: true })

/* write validation for validating mediaFiles requirement if postType is media */

export default model("posts", postSchema, "posts")