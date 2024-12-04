import { FollowStatus, IFollow } from "@entities/interfaces/follow.interface.js";
import { model, Schema } from "mongoose";

const followSchema = new Schema<IFollow>({
    follower_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    followee_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(FollowStatus),
        default: FollowStatus.active
    },
    close_friends: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

followSchema.index({
    follower_id: 1,
    followee_id: 1
}, { unique: true })

followSchema.index({ follower_id: 1 })
followSchema.index({ followee_id: 1 })

export default model("follow", followSchema, "follows");