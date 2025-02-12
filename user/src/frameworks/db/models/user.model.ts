import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { HydratedDocument, Schema, Types, model } from "mongoose";

// const LinkSchema = new Schema({
//     title: { type: String, required: true },
//     url: { type: String, required: true }
// }, { _id: false })

const NotificationsSchema = new Schema({
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    stories: { type: Boolean, default: true },
    posts: { type: Boolean, default: true },
    liveStream: { type: Boolean, default: true }
}, { _id: false })

const configurationSchema = new Schema({
    suggestionInProfile: { type: Boolean, default: true },
    PushNotifications: { type: NotificationsSchema },
    inAppNotifications: { type: NotificationsSchema },
}, { _id: false });



const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username required & should be a string"],
        unique: true,
        index: 1
    },
    displayname: {
        type: String,
        required: [true, "display name required & should be a string"]
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        index: 1
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    gender: {
        type: String,
        enum: {
            values: ["M", "F"],
            message: "`{PATH}` should either be 'M' | 'F'."
        },
        default: undefined
    },
    blockedUsers: [Types.ObjectId],
    links: [String],
    configuration: {
        type: configurationSchema,
        default: {}
    },
    privateAccount:{
        type: Boolean,
        default: false
    },
    bio: String,
    cover: String,
    avatar: String,
    followingsCount: {
        type: Number,
        default: 0,
        required: true
    },
    followersCount: {
        type: Number,
        default: 0,
        required: true
    },
    postsCount: {
        type: Number,
        default: 0,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
    /* LAST-SEEN Field */
}, {
    timestamps: true,
    toObject: {
        transform(doc, ret) {
            // delete ret._id
            delete ret.password;
            delete ret.__v;
        },
    }
})



export type HydratedUser = HydratedDocument<IUser, { createdAt: Date, updatedAt: Date }>;

export const userModel = model<IUser>("User", UserSchema, "users");