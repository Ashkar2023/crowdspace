import { Schema, Types } from "mongoose";
import { msgContentType } from "./message.type.js";

export type IChat = {
    last_message: {
        time: Date,
        body: string | null,
        msg_type: msgContentType
    },
    participants: Schema.Types.ObjectId[],
    unread_messages: number
}