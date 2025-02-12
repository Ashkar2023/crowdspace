import { consumerEvents, decodeEventMessage, NotificationKind, rabbitmqConfig, SocketEvents } from "@cr0wdspace/common";
import { io } from "../index.js";
import { consumerChannel } from "./index.js";
import { envConfig } from "config/envConfig.js";


consumerChannel.consume(rabbitmqConfig.queues.chat,
    async (message) => {
        if (!message?.content) {
            console.log("message event null");
            return
        }

        const { event, body } = decodeEventMessage(message.content);

        if (envConfig.NODE_ENV === "development") console.log(event, body);

        let socketId;

        if (body.recipient_id) {
            socketId = RetrieveCorrespondingId(body.recipient_id); //post owner
        }

        const fetchActorBasics = async (userId: string) => (
            await (
                await fetch(process.env.USER_SERVICE + "/basic/" + userId)
            ).json()
        ).body;

        switch (event) {
            case consumerEvents.new_comment: {
                if (socketId) {
                    io.to(socketId)
                        .emit(SocketEvents.notification, {
                            ...body,
                            actor: await fetchActorBasics(body.actor)
                        });
                }

                break;
            }

            case consumerEvents.new_like: {
                if (socketId) {
                    io.to(socketId)
                        .emit(SocketEvents.notification, {
                            ...body,
                            actor: await fetchActorBasics(body.actor)
                        });
                }
                break;
            }

            case consumerEvents.new_message: {
                if (body.receiverSocketId) { //socket id already sent from the controller as receiverSocketId
                    io.to(body.receiverSocketId)
                        .emit(SocketEvents.notification, {
                            ...body,
                            type: NotificationKind.message,
                            actor: await fetchActorBasics(body.sender)
                        });
                }
                break;
            }

            case consumerEvents.follow: {
                if (socketId) {
                    io.to(socketId)
                        .emit(SocketEvents.notification, {
                            ...body,
                            type: NotificationKind.follow,
                            actor: await fetchActorBasics(body.follower_id)
                        });
                }
                break;
            }

            case consumerEvents.avatar_updated: {
                if (socketId) {
                    io.to(socketId).emit(SocketEvents.avatar_updated, { avatar: body.avatar });
                }
                break;
            }

            case consumerEvents.follow_request: {
                if (socketId) {
                    io.to(socketId).emit(SocketEvents.notification,
                        {
                            ...body,
                            type: NotificationKind.followRequest,
                            actor: await fetchActorBasics(body.follower_id),
                        }
                    );
                }
                break;
            }

            default:
                break;
        }
    },
    {
        noAck: true
    }
)