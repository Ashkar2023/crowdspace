import { NotificationKind } from "@cr0wdspace/common"
import { Types } from "mongoose"

export enum followRequestStatus {
    pending = "pending",
    accepted = "accepted",
    declined = "declined"
}

export type INotification = {
    actor: Types.ObjectId,
    is_read: boolean,
    recipient_id: Types.ObjectId,
    /**
     * the target Id of the action doc
     * ex: actual comment/like or follow request.
     */
    target: Types.ObjectId,
} & (
        | { type: NotificationKind.followRequest, status: followRequestStatus  }
        | { type: Exclude<NotificationKind, NotificationKind.followRequest> }
    )