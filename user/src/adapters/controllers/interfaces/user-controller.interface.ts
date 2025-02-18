import { IResponse } from "@cr0wdspace/common";
import { Request } from "express"

export interface IUserController {
    getUserBasicProfile: (req: Request) => Promise<IResponse>
    getMultipleUsersBasicProfile: (req: Request) => Promise<IResponse>
    getUserProfile: (req: Request) => Promise<IResponse>

    followUser: (req: Request) => Promise<IResponse>
    unfollowUser: (req: Request) => Promise<IResponse>

    acceptFollowRequest: (req: Request) => Promise<IResponse>

    getFollows: (req: Request) => Promise<IResponse>

    search: (req: Request) => Promise<IResponse>

    removeFollower: (req: Request) => Promise<IResponse>
    
    getFollowers: (req: Request) => Promise<IResponse>
    getFollowings: (req: Request) => Promise<IResponse>
}