import { IUser } from "@interfaces/entity.interface";
import { Schema, Types, model } from "mongoose";

const LinkSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: false })

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
    darkTheme: { type: Boolean, default: false },
    privateAccount: { type: Boolean, default: false },
    suggestionInProfile: { type: Boolean, default: true },
    PushNotifications: { type: NotificationsSchema, default:()=>({}) },
    inAppNotifications: { type: NotificationsSchema, default:()=>({}) },
}, { _id: false });


const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username required & should be a string"],
        index: 1
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    gender: {
        type: String,
        enum: {
            values: ["M", "F"],
            message: "`{PATH}` should either be 'M' | 'F'."
        }
    },
    blockedUsers: [Types.ObjectId],
    links: [LinkSchema],
    configuration: {
        type: configurationSchema,
        required: true,
        // default: ()=>({})
    },
    bio: String,
    cover: String,
    avatar: String,
})


const userModel = model<IUser>("User", UserSchema, "Users");
export default userModel;