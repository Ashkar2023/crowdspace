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
                        { $match: { followee_id: user_id } }
                    ],
                    "followings": [
                        { $match: { follower_id: user_id } }
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

        console.log(result)
        return result[0];
    }
}