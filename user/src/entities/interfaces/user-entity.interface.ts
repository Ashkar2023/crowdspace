import { ObjectId } from "mongoose"
import { UUID } from "node:crypto"

// export type Link = {
//     title: string,
//     url: string
// }

export type Configuration = {
    // privateAccount: boolean,
    suggestionInProfile: boolean,
    PushNotifications: {
        likes: boolean,
        comments: boolean,
        follows: boolean,
        messages: boolean,
        stories: boolean,
        posts: boolean,
        liveStream: boolean
    },
    inAppNotifications: {
        likes: boolean,
        comments: boolean,
        follows: boolean,
        messages: boolean,
        stories: boolean,
        posts: boolean,
        liveStream: boolean
    }
}

// core user fields 
export type IUser = {
    _id?:string,
    username: string,
    displayname: string,
    email: string,
    password: string,
    gender?: "M" | "F",
    isVerified?: boolean,
    isBanned?: boolean,
    blockedUsers?: ObjectId[]
    configuration?: Configuration,
    privateAccount?: boolean,
    bio?: string,
    links?: string[],
    cover?: string,
    avatar?: string,
    resetToken?:UUID,
    resetTokenExpiry?:Date
    postsCount?:number,
    followersCount?:number,
    followingsCount?:number,
    role: "admin" | "user"
}


// USER ENTITY - with user state & behaviour
export interface IUserEntity extends IUser {
    validate: () => void,
    get: () => IUser
}
