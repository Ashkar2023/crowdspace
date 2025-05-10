import { notificationModel } from "models/notification.model.js";
import { Document, HydratedDocument, Model, Types } from "mongoose";
import { followRequestStatus, INotification } from "~types/notification.types.js";


export class NotificationRepository {
    #model: Model<INotification> = notificationModel;

    constructor() { }

    async createNotification(notificationData: INotification): Promise<HydratedDocument<INotification>> {
        return await this.#model.create(notificationData);
    }

    async getAllNotifications(userId: string | Types.ObjectId): Promise<INotification[]> {
        if (!(userId instanceof Types.ObjectId)) {
            userId = new Types.ObjectId(userId);
        }

        return await this.#model.find({ recipient_id: userId }).sort({ createdAt: -1 });
    }


    async deleteNotificationByTargetId(notificationId: Types.ObjectId): Promise<(Document & INotification) | null> {
        return await this.#model.findOneAndDelete({ target: notificationId });
    }


    async updateNotification(follow_doc_id: Types.ObjectId, status: followRequestStatus): Promise<INotification | null> {
        return await this.#model.findOneAndUpdate({ target: follow_doc_id }, { $set: { status } }, { new: true });
    }

    // async getNotificationById(notificationId: Types.ObjectId): Promise<INotification | null> {
    //     return await notificationModel.findById(notificationId).exec();
    // }

}