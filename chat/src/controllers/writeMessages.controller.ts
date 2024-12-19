// //Socket controller
import { SocketEvents } from "@crowdspace/common";
import { HydratedDocument, isValidObjectId, Schema, Types } from "mongoose";
import { chatRepoImp, messageRepoImp } from "repositories/index.repos.js";
import redisClient from "services/redis.client.js";
import { Server, Socket } from "socket.io";
import { getParsedReceiver } from "utils/getParsedReciever.js";
import { IChat } from "~types/chat.type.js";
import { IMessage } from "~types/message.type.js";

const writeMessage = (socket: Socket, io: Server) => {

    return async function (message: IMessage) { //try catch blocks need refactoring, currently doesnt handle every actions in this

        const start = performance.now();
        const userId = socket.handshake.auth.userId as string;
        const userObjectId = new Types.ObjectId(userId);

        let chatDoc, cachedChat;

        if (!isValidObjectId(message.chat_id)) {
            return socket.emit(SocketEvents.client_error, "no valid chat identifier found");
        }

        if (message.chat_id) {
            const hashKey = `chat:${message.chat_id}`;
            cachedChat = await redisClient.HGETALL(hashKey); //returns as empty-object {} if no cache is present

            const TTL = await redisClient.TTL(hashKey);

            if (TTL < 100) {
                redisClient.EXPIRE(hashKey, 300);
            }

            // chatDoc = cachedChat; // for a single point of access in next lines
            cachedChat.chatId && console.log('cache hit', cachedChat);
        }

        if (!cachedChat?.chatId) {
            const chatObjectId = new Types.ObjectId(message.chat_id);

            chatDoc = await chatRepoImp.findChat(chatObjectId, userObjectId) as HydratedDocument<IChat>;
            console.log("chatDoc", chatDoc)
            try {
                /* HANDLE if any case where the chat is not in DB */
                // if (!chatDoc) {
                //     chatDoc = await chatRepoImp.createChat(userObjectId, recieverObjectId);
                //     console.log("chat created:", chatDoc.id);
                // }

                const hashKey = `chat:${chatDoc.id}`;

                const storedToCache = await redisClient.HSET(hashKey, {
                    chatId: chatDoc.id,
                    lastMessage: JSON.stringify(chatDoc.last_message),
                    unreadMessages: chatDoc.unread_messages,
                    participants: JSON.stringify(chatDoc.participants), /* FOCUS */
                });

                const setExpiry = redisClient.EXPIRE(hashKey, 300, "NX"); //change to valid time for cache

                console.log("storedToCache", storedToCache);

            } catch (error) {
                if (error instanceof Error) {
                    console.log("error from catch block", error.message);
                }
            }

        }

        /**
         * Db level validation is ok, but should add app level validation
         * so we can eliminate some issues 
         * 
         * */

        if (cachedChat?.chatId ?? chatDoc?.id) {
            // validate sender and reciever and also chat
        }

        const storeMessagePromise = messageRepoImp.createMessage(
            new Types.ObjectId(cachedChat?.chatId ?? chatDoc?._id),
            userObjectId,
            message.body,
            message.content_type,
            message.media_url,
            message.reply_to
        );

        let participants = cachedChat?.participants ?? chatDoc?.participants;
        const parsedReceiver = getParsedReceiver(participants!, userId)
        const receiverSocketId = getSocketId(parsedReceiver);
        console.table({ parsedReceiver, receiverSocketId });// REMOVE

        try {
            const messageStored = await storeMessagePromise; // awaited here to run the other tasks parallely for time saving
            console.log("messageStored", messageStored.id);

            io.to([receiverSocketId, socket.id]).emit(SocketEvents.recv_msg, messageStored); // Latency waiting for the message to store

        } catch (error) {
            if (error instanceof Error) {
                socket.emit(SocketEvents.client_error, error.message);
            } else {
                console.log(error)
            }
        }
        const end = performance.now()
        console.log(end - start)
    }
}

export default writeMessage;