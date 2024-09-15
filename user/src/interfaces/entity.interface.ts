import { ObjectId } from "mongoose"

/* User */
export type Link = {
    title: string,
    url: string
}

export type Configuration = {
    darkTheme: boolean,
    privateAccount: boolean,
    suggestionInProfile:boolean,
    PushNotifications: {
        likes: boolean,
        comments: boolean,
        follows: boolean,
        messages: boolean,
        stories: boolean,
        posts: boolean,
        liveStream: boolean
    },
    inAppNotifications:{
        likes: boolean,
        comments: boolean,
        follows: boolean,
        messages: boolean,
        stories: boolean,
        posts: boolean,
        liveStream: boolean
    }
}

// core user props 
export type IUser = {
    username: string,
    email: string,
    password: string,
    gender: "M" | "F",
    blockedUsers: ObjectId[]
    configuration: Configuration,
    bio?: string,
    links?: Link[],
    cover?: string,
    avatar?: string,
}

// USER ENTITY - with user state & behaviour
export interface IUserEntity extends IUser {
    validate:()=> void,
    validateConfig: ()=> boolean,
    get:()=>  IUser
}



/* Follows */

// export type Follows = {

// }