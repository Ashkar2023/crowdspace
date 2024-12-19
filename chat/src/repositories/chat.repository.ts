import chatModel from "models/chat.model.js";
import { Model, Types } from "mongoose";
import { IChat } from "~types/chat.type.js";

export class ChatRepository {
    #model: Model<IChat> = chatModel;

    async findAllChats(
        user_id: Types.ObjectId
    ) {
        return await this.#model.find({ participants: user_id });
    }

    async findChat(
        chat_id: Types.ObjectId,
        user_id: Types.ObjectId,
    ) {
        return await this.#model.findOne({ _id: chat_id, participants: { $in: [user_id] } });
    }

    async findChatByParticipants(
        user_id: Types.ObjectId,
        end_user_id: Types.ObjectId,
    ) {
        return await this.#model.findOne({ participants: { $all: [user_id, end_user_id] } });
    }

    async createChat(
        user_id: Types.ObjectId,
        receiver_id: Types.ObjectId,
    ) {
        const doc = await this.#model.create({
            participants: [user_id, receiver_id].sort(),
        })

        return doc;
    }

}