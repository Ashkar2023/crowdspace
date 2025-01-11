import { notificationModel } from "models/notification.model.js";
import { Document, Model, Types } from "mongoose";
import { INotification } from "~types/notification.types.js";


export class NotificationRepository {
    #model: Model<INotification> = notificationModel;

    constructor() { }

    async createNotification(notificationData: INotification): Promise<INotification> {
        return await this.#model.create(notificationData);
    }

    async getAllNotifications(userId: string | Types.ObjectId): Promise<INotification[]> {
        if(!(userId instanceof Types.ObjectId)){
            userId = new Types.ObjectId(userId);
        }
        
        return await this.#model.find({ recipient_id: userId });
    }


    async deleteNotification(notificationId: Types.ObjectId): Promise<(Document & INotification) | null> {
        return await this.#model.findByIdAndDelete(notificationId);
    }


    // async getNotificationById(notificationId: Types.ObjectId): Promise<INotification | null> {
    //     return await notificationModel.findById(notificationId).exec();
    // }

    // async updateNotification(notificationId: Types.ObjectId, updateData: Partial<INotification>): Promise<INotification | null> {
    //     return await notificationModel.findByIdAndUpdate(notificationId, updateData, { new: true }).exec();
    // }

}