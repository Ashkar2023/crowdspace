// //Socket controller
import { SocketEvents } from "@crowdspace/common";
import { Types } from "mongoose";
import { chatRepoImp, messageRepoImp } from "repositories/index.repos.js";
import redisClient from "services/redis.client.js";
import { Server, Socket } from "socket.io";
import { IMessage } from "~types/message.type.js";

const writeMessage = (socket: Socket, io: Server) => {

    return async function (message: IMessage) {

        const userId = socket.handshake.auth.userId as string;
        const receiverId = message.reciever; //type mismatched here, is string actually
        const userObjectId = new Types.ObjectId(userId);

        let chatDoc, cachedChat;

        if (message.chat_id) {
            const hashKey = `chat:${message.chat_id}`;
            cachedChat = await redisClient.HGETALL(hashKey);

            const TTL = await redisClient.TTL(hashKey);

            if (TTL < 100) {
                redisClient.EXPIRE(hashKey, 300, "GT");
            }

            console.log('cachedChat', cachedChat);
        }

        if (!cachedChat) {
            const recieverObjectId = new Types.ObjectId(receiverId);

            chatDoc = await chatRepoImp.findChatByParticipants(userObjectId, recieverObjectId);

            try {
                if (!chatDoc) {
                    chatDoc = await chatRepoImp.createChat(userObjectId, recieverObjectId);
                    console.log("chat created:", chatDoc);
                }

                const hashKey = `chat:${chatDoc.id}`;

                const storedToCache = await redisClient.HSET(hashKey, {
                    chatId: chatDoc.id,
                    lastMessage: JSON.stringify(chatDoc.last_message),
                    unreadMessages: chatDoc.unread_messages
                });

                const setExpiry = redisClient.EXPIRE(hashKey, 300, "NX"); //change to valid time for cache

                console.log("storedToCache", storedToCache);

            } catch (error) {
                if (error instanceof Error) {
                    console.log("error from catch block", error.message);
                }
            }

        }

        // Db level validation is ok, but should add app level validation so we can eliminate some issues

        const storeMessagePromise = messageRepoImp.createMessage(
            new Types.ObjectId(cachedChat?.chat_id ?? chatDoc?._id),
            userObjectId,
            message.body,
            message.content_type,
            message.media_url,
            message.reply_to
        );

        const parsedRecieverId = getSocketId(receiverId);


        try {
            const messageStored = await storeMessagePromise;
            console.log("messageStored", messageStored);

            if (parsedRecieverId) { // one issue waiting for the message to store
                io.to([parsedRecieverId, socket.id]).emit(SocketEvents.recv_msg, messageStored);
                // socket.emit(SocketEvents.recv_msg, messageStored);
            }
        } catch (error) {
            if (error instanceof Error) {
                socket.emit(SocketEvents.client_error, error.message);
            } else {
                console.log(error)
            }
        }
    }
}

export default writeMessage;