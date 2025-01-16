import { NotificationKind } from "@cr0wdspace/common";
import { model, Schema } from "mongoose";
import { INotification } from "~types/notification.types.js";


const notificationSchema = new Schema<INotification>({
    type: {
        type:String,
        enum: Object.values(NotificationKind),
        required:true
    },
    actor:{
        type:Schema.Types.ObjectId,
        required:true
    },
    is_read:{
        type:Boolean,
        default:false
    },
    recipient_id:{
        type:Schema.Types.ObjectId,
        required:true
    },
    target:{
        type:Schema.Types.ObjectId,
        required:true
    }
},{
    timestamps:true
})

export const notificationModel = model("notifications", notificationSchema, "notifications");