import { consumerEvents, decodeEventMessage, NotificationKind, rabbitmqConfig } from "@cr0wdspace/common";
import { consumerChannel } from "./index.js";
import { NotificationRepoImp, PostRepoImp } from "repositories/repositories.index.js";
import { followRequestStatus } from "~types/notification.types.js";
import { Types } from "mongoose";

consumerChannel.consume(rabbitmqConfig.queues.content,
    async (message) => {
        if (!message?.content) {
            console.log("message event null");
            return
        }

        const { event, body } = decodeEventMessage(message.content);
        console.log("event",event);

        switch (event) {
            case consumerEvents.follow: {
                try {
                    const notification = await NotificationRepoImp.createNotification({
                        actor: body.follow_doc.follower_id,
                        is_read: false,
                        recipient_id: body.follow_doc.followee_id,
                        target: body.follow_doc._id,
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
                    const deleted = await NotificationRepoImp.deleteNotificationByTargetId(new Types.ObjectId(body.target_id as string));
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

            case consumerEvents.follow_request: {
                try {
                    /* 
                    //  could have reused the types from the common package
                    //  the follow doc type is not available here
                     */
                    const followReqNotification = await NotificationRepoImp.createNotification({
                        actor: body.follow_doc.follower_id,
                        is_read: false,
                        recipient_id: body.follow_doc.followee_id,
                        target: body.follow_doc._id,
                        type: NotificationKind.followRequest,
                        status: followRequestStatus.pending
                    });

                    console.log("(followReqNotification",followReqNotification);

                } catch (error) {
                    console.log((error as Error).message)
                }
                break;
            }
            
            case consumerEvents.follow_req_accepted: {
                // update the follow doc status
                try{
                    const followUpdated = await NotificationRepoImp.updateNotification(body.follow_doc._id, followRequestStatus.accepted);
                    process.env.NODE_ENV === "development" && console.log("followUpdated",followUpdated);
                }catch(error){
                    console.log((error as Error))
                }
                break;
            }
            
            case consumerEvents.media_upload_success: {
                try{
                    const result = await PostRepoImp.createPost(body);
                }catch(error){
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