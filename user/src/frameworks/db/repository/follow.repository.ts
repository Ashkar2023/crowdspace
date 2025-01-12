import { IFollow } from "@entities/interfaces/follow.interface.js";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { HydratedDocument, Model, Types } from "mongoose";
import { FollowStatus } from "@entities/interfaces/follow.interface.js";
import followModel from "../models/follow.model.js";

export class FollowRepositoryImp implements IFollowRepository {
    #model: Model<IFollow> = followModel;

    constructor() { }

    async doFollow(
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
        followee_private: boolean
    ) {
        return await this.#model.create({
            follower_id: follower_id,
            followee_id: followee_id,
            status: followee_private ? FollowStatus.pending : FollowStatus.active
        })
    };

    async doUnfollow(
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) {
        return await this.#model.findOneAndDelete({
            follower_id,
            followee_id
        })
    };

    async findConnection(
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) {

        const result = await this.#model.aggregate([
            {
                //Optimize to remove collscan and use index instead for querying on the docs with $facet
                $facet: {
                    outgoingFollow: [
                        {
                            $match: {
                                follower_id: follower_id,
                                followee_id: followee_id
                            }
                        }
                    ],
                    incomingFollow: [
                        {
                            $match: {
                                follower_id: followee_id,
                                followee_id: follower_id,
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    outgoingFollow: { $arrayElemAt: ["$outgoingFollow", 0] },
                    incomingFollow: { $arrayElemAt: ["$incomingFollow", 0] }
                }
            }
        ])

        return result[0];
    }


    async followExists(
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) {
        return await this.#model.findOne({ follower_id, followee_id });
    }


    async getFollowersAndFollowees(user_id: Types.ObjectId) {
        const result = await this.#model.aggregate([
            {
                $match: {
                    $or: [
                        { followee_id: user_id },
                        { follower_id: user_id },
                    ]
                }
            },
            {
                $facet: {
                    "followers": [
                        {
                            $match: { followee_id: user_id }
                        },
                        {
                            $lookup: {
                                from: "users",
                                foreignField: "_id",
                                localField: "follower_id",
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            displayname: 1,
                                            avatar: 1
                                        }
                                    }
                                ],
                                as: "follower_info"
                            }
                        },
                        {
                            $addFields: {
                                follower_info: { $arrayElemAt: ["$follower_info", 0] }
                            }
                        }
                    ],
                    "followings": [
                        {
                            $match: { follower_id: user_id }
                        },
                        {
                            $lookup: {
                                from: "users",
                                foreignField: "_id",
                                localField: "followee_id",
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            displayname: 1,
                                            avatar: 1
                                        }
                                    }
                                ],
                                as: "followee_info"
                            }
                        },
                        {
                            $addFields: {
                                followee_info: { $arrayElemAt: ["$followee_info", 0] }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    followers: "$followers",
                    followings: "$followings",
                    followersCount: { $size: "$followers" },
                    followingsCount: { $size: "$followings" },
                }
            }
        ]);

        return result[0];
    }

    async removeFollower(follower_id: Types.ObjectId, loggedInUserId: Types.ObjectId) {
        return await this.#model.findOneAndDelete({ followee_id: loggedInUserId, follower_id });
    }

    async getFollowers(followee_id: Types.ObjectId, page: number) {
        const result = await this.#model.aggregate([
            {
                $match: {
                    followee_id
                }
            },
            {
                $skip: (page - 1) * 2
            },
            {
                $limit: 2
            },
            {
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"follower_id",
                    pipeline:[
                        {
                            $project:{
                                avatar:1,
                                displayname:1,
                                username:1
                            }
                        }
                    ],
                    as:"follower_info"
                }
            },
            {
                $addFields: {
                    follower_info: { $arrayElemAt: ["$follower_info", 0] }
                }
            }
        ])

        return result;
    }

    
    async getFollowings(follower_id: Types.ObjectId, page: number) {
        const result = await this.#model.aggregate([
            {
                $match: {
                    follower_id
                }
            },
            {
                $skip: (page - 1) * 2
            },
            {
                $limit: 2
            },
            {
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"followee_id",
                    pipeline:[
                        {
                            $project:{
                                avatar:1,
                                displayname:1,
                                username:1
                            }
                        }
                    ],
                    as:"followee_info"
                }
            },
            {
                $addFields: {
                    followee_info: { $arrayElemAt: ["$followee_info", 0] }
                }
            }
        ])

        console.log("Followings",result)

        return result;
    }
}