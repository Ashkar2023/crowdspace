import { ObjectId } from "mongoose"
import { UUID } from "node:crypto"

// export type Link = {
//     title: string,
//     url: string
// }

export type Configuration = {
    privateAccount: boolean,
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
    blockedUsers?: ObjectId[]
    configuration?: Configuration,
    bio?: string,
    links?: string[],
    cover?: string,
    avatar?: string,
    resetToken?:UUID,
    resetTokenExpiry?:Date
}


// USER ENTITY - with user state & behaviour
export interface IUserEntity extends IUser {
    validate: () => void,
    validateConfig: () => boolean,
    get: () => IUser
}
