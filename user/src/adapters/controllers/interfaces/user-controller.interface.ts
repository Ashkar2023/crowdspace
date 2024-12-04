import { IResponse } from "@crowdspace/common";
import { Request } from "express"

export interface IUserController {
    getUserProfile: (req: Request) => Promise<IResponse>

    followUser: (req: Request) => Promise<IResponse>
    unfollowUser: (req: Request) => Promise<IResponse>

    getFollows: (req: Request) => Promise<IResponse>
}