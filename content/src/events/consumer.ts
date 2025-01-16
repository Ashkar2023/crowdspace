import { consumerEvents, decodeEventMessage, NotificationKind, rabbitmqConfig } from "@cr0wdspace/common";
import { consumerChannel } from "./index.js";
import { NotificationRepoImp } from "repositories/repositories.index.js";

consumerChannel.consume(rabbitmqConfig.queues.content,
    async (message) => {
        if (!message?.content) {
            console.log("message event null");
            return
        }

        const { event, body } = decodeEventMessage(message.content);
        console.log(event);

        switch (event) {
            case consumerEvents.follow: {
                try {
                    const notification = await NotificationRepoImp.createNotification({
                        actor: body.follower_id,
                        is_read: false,
                        recipient_id: body.follower_id,
                        target: body.follow_doc_id,
                        type: NotificationKind.follow
                    })
                    console.log('created notification', notification);
                } catch (error) {
                    console.log("notification create error", (error as Error).message)
                }
                break;
            }

            case consumerEvents.unfollow: {
                try {
                    const deleted = await NotificationRepoImp.deleteNotification(body.notification_id);
                    console.log(body);
                    console.log("deleted", deleted);
                } catch (error) {
                    console.log("notification delete error", (error as Error).message)
                }
                break
            }

            case consumerEvents.post_deleted: {
                try {
                    // write
                } catch (error) {
                    console.log((error as Error).message)
                }
                break
            }
        }
    },
    {
        noAck: true
    }
)