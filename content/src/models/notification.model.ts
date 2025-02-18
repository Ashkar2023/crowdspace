import { NotificationKind } from "@cr0wdspace/common";
import { model, Schema } from "mongoose";
import { followRequestStatus, INotification } from "~types/notification.types.js";


const notificationSchema = new Schema<INotification>({
    type: {
        type: String,
        enum: Object.values(NotificationKind),
        required: true
    },
    actor: {
        type: Schema.Types.ObjectId,
        required: true
    },
    is_read: {
        type: Boolean,
        default: false
    },
    recipient_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    target: {
        /**
        * the target Id of the action object
        * Ex: the actual comment/like or follow request.
        */
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum : Object.values(followRequestStatus),
        default: followRequestStatus.pending,
        required() {
            return this.type === NotificationKind.followRequest
        },
    }
}, {
    timestamps: true
})

export const notificationModel = model("notifications", notificationSchema, "notifications");