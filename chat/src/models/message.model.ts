import { model, MongooseError, Schema, Types } from "mongoose";
import { TextEncoder } from "node:util";
import { IMessage, messageStatus, msgContentType } from "~types/message.type.js";

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
        default: null
    },
    content_type: {
        type: String,
        required: true,
        enum: Object.values(msgContentType),
        default: msgContentType.text
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(messageStatus),
        default: messageStatus.sent
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

/* Use indexes */

messageSchema.pre("save", function (next) {
    const body = this.body?.trim();

    if (this.content_type === msgContentType.text && !body) {
        return next(new Error("Text messages must have a non-empty body."));

    } else if (this.content_type !== msgContentType.text && !this.media_url) {
        return next(new Error("Non-text messages must have a url."));
    }

    if (this.content_type === msgContentType.text && body) {
        this.body = Buffer.from(body).toString("base64");
    }

    next();
});

messageSchema.post("find", function (docs: IMessage[]) {
    for(let doc of docs){
        if(doc.content_type === msgContentType.text){
            doc.body = Buffer.from(doc.body!, "base64").toString("utf-8")
        }
    }
})

export default model("message", messageSchema, "messages");