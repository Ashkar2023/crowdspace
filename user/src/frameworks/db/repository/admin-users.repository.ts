import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IAdminUsersRepository } from "@interactors/interfaces/repositories/admin-user-repository.interface.js";
import { Model, Types } from "mongoose";

export class AdminUsersRepository implements IAdminUsersRepository {
    private model: Model<IUser>;

    constructor(userModel: Model<IUser>) {
        this.model = userModel;
    }


    async getUsers(page: number, limit: number) {
        const result = await this.model.aggregate([
            {
                $facet: {
                    "users": [
                        { $match: {} },
                        { $sort: { "createdAt": -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    "totalUsers": [
                        { $count: "count" }
                    ]
                }
            }
        ])

        const finalResult = result[0];

        return {
            users: finalResult.users,
            totalUsers: finalResult.totalUsers[0].count,
        }
    }


    async findUserById(userId: string, select: string = "") {
        return await this.model.findById(userId).select(select);
    }


    async banUser(userId: string) {
        return await this.model.findOneAndUpdate({ _id: new Types.ObjectId(userId) },
            {
                $set: {
                    isBanned: true
                }
            },
            { new: true }
        )
    }

    async unbanUser(userId: string) {
        return await this.model.findOneAndUpdate({ _id: new Types.ObjectId(userId) },
            {
                $set: {
                    isBanned: false
                }
            },
            { new: true }
        )
    }


}