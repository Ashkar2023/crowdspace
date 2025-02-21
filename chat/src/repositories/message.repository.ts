import messageModel from "../models/message.model.js";
import { DeleteResult, Model, Types } from "mongoose";
import { IMessage, msgContentType } from "~types/message.type.js";

export class MessageRepository {
    #model: Model<IMessage> = messageModel;

    async findMessages(chat_id: Types.ObjectId) {
        return await this.#model.find({ chat_id }).sort({ createdAt: 1 });
    }

    async createMessage(
        chat_id: Types.ObjectId,
        sender_id: Types.ObjectId,
        body: string | null,
        content_type: msgContentType,
        media_url?: string,
        reply_to?: Types.ObjectId
    ) {
        const newMessage = {
            chat_id,
            sender: sender_id,
            body,
            content_type,
            media_url,
            reply_to,
        };

        const message = await this.#model.create(newMessage);
        if (message.content_type === msgContentType.text) {
            return { ...message.toObject(), body: Buffer.from(message.body!, "base64").toString("utf-8") }
        }

        return message.toObject()
    }

    async deleteMessage(message_id: Types.ObjectId): Promise<DeleteResult> {
        return await this.#model.deleteOne({ _id: message_id });
    }
}