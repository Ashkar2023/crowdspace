import { model, Schema, Types } from "mongoose";
import { IChat } from "~types/chat.type.js";

const chatSchema = new Schema<IChat>({
    last_message: {
        type: {
            msg_type: { type: String, required: true },
            time: { type: Schema.Types.Date, required: true },
            body: { type: String, default: null },
        },
        default: null
    },
    participants: {
        type: [Types.ObjectId],
        required: true,
        validate: {
            validator: function (value) {
                return value.length === 2;
            },
            message: "A chat must have 2 participants"
        },
        index: 1, //make this into two fields for indexing or check if the record exists when creating
    },
    unread_messages: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
})

/* Use indexes */

export default model("chat", chatSchema, "chats");