import { model, MongooseError, Schema, Types } from "mongoose";
import { IMessage, msgContentType } from "~types/message.type.js";

const messageSchema = new Schema<IMessage>({
    chat_id: {
        type: Schema.Types.ObjectId,
        ref: "chat"
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        default: null,
    },
    content_type: {
        type: String,
        required: true,
        enum: Object.values(msgContentType),
        default: msgContentType.text
    },
    media_url: {
        type: String,
    },
    reply_to: {
        type: Schema.Types.ObjectId,
        ref: 'message',
    },
}, {
    timestamps: true
})


messageSchema.pre("save", function (next) {
    if (this.content_type === msgContentType.text && !this.body?.trim()) {
        return next(new Error("Text messages must have a non-empty body."));

    } else if (this.content_type !== msgContentType.text && !this.media_url) {
        return next(new Error("Non-text messages must have a url."));
    }

    next();
});
export default model("message", messageSchema, "messages");