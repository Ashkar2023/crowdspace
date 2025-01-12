import { consumerEvents, decodeEventMessage, encodeEventMessage, rabbitmqConfig } from "@crowdspace/common";
import { consumerChannel, publisherChannel } from "./events.service.js";
import { UserRepositoryImp } from "@frameworks/db/repository/user.repository.js";
import { userModel } from "@frameworks/db/models/user.model.js";
import { Types } from "mongoose";

const UserRepository = new UserRepositoryImp(userModel);

consumerChannel.consume(rabbitmqConfig.queues.user,
    async (message) => {
        if (!message?.content) {
            console.log("message event null");
            return
        }

        const { body, event } = decodeEventMessage(message.content);
        console.log({
            body,
            event
        })

        switch (event) {
            case consumerEvents.avatar_upload_success: {
                try {
                    const updated = await UserRepository.updateProfileAvatar(
                        new Types.ObjectId(body.user_id as string),
                        body.avatar_url
                    )

                    /*  send event to DELETE the old avatar media, if any */

                    const bodyObject = encodeEventMessage(consumerEvents.avatar_updated, {
                        avatar: body.avatar_url,
                        recipient_id: body.user_id,
                        timestamp: new Date()
                    });

                    publisherChannel.publish(
                        rabbitmqConfig.exchanges.notificationFanout.name,
                        rabbitmqConfig.routingKeys.chat.notificationFanout, // value is "" which is same for every service for the fanout service
                        bodyObject
                    );

                    // winston log

                    if (updated.modifiedCount) {
                        consumerChannel.ack(message);
                    }
                    
                } catch (error) {
                    console.log((error as Error).message)
                }
                break;
            }
        }
    },
    {
        noAck: true
    }
)