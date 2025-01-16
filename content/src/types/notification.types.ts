import { NotificationKind } from "@cr0wdspace/common"
import { Types } from "mongoose"


export type INotification = {
    type: NotificationKind,
    actor: Types.ObjectId,
    is_read: boolean,
    recipient_id: Types.ObjectId,
    /**
     * the target Id of the notification
     * the actual comment/like or follow request.
     */
    target: Types.ObjectId
}