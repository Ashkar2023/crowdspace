import { Types } from "mongoose"

export enum msgContentType {
    image = "image",
    video = "video",
    text = "text"
}

export enum messageStatus {
    delivered = "delivered",
    seen = "seen",
    sent = "sent"
}

export type IMessage = {
    chat_id: Types.ObjectId,
    content_type: msgContentType,
    body: string | null,
    media_url: string | undefined,
    sender: Types.ObjectId,
    reciever: string, // this is not in databas model so string
    reply_to: Types.ObjectId | undefined,
    deleted: boolean,
    status: messageStatus
}