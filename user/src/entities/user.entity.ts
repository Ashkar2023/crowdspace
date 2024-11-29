import { Configuration, IUser, IUserEntity } from "@entities/interfaces/user-entity.interface.js";
import { Schema } from "mongoose";
import { UUID } from "node:crypto";

export class UserEntity implements IUserEntity {
    username: string;
    displayname: string;
    email: string;
    password: string;
    gender?: "M" | "F" | undefined;
    isVerified?: boolean | undefined;
    isBanned: boolean;
    blockedUsers?: Schema.Types.ObjectId[] | undefined;
    configuration?: Configuration | undefined;
    bio?: string | undefined;
    links?: string[] | undefined;
    cover?: string | undefined;
    avatar?: string | undefined;
    resetToken?: UUID | undefined;
    resetTokenExpiry?: Date | undefined;

    private static defaultConfiguration: Configuration = {
        privateAccount: false,
        suggestionInProfile: true,
        PushNotifications: {
            likes: true,
            comments: true,
            follows: true,
            messages: true,
            stories: true,
            posts: true,
            liveStream: true
        },
        inAppNotifications: {
            likes: true,
            comments: true,
            follows: true,
            messages: true,
            stories: true,
            posts: true,
            liveStream: true
        }
    };

    constructor(data: IUser) {
        this.username = data.username;
        this.displayname = data.displayname;
        this.email = data.email;
        this.password = data.password;
        this.gender = data.gender || undefined;
        this.isVerified = data.isVerified || false;
        this.isBanned = false;
        this.blockedUsers = data.blockedUsers || [];
        this.configuration = data.configuration || undefined;
        this.bio = data.bio || "";
        this.links = data.links || [];
        this.cover = data.cover || "";
        this.avatar = data.avatar || "";
        this.resetToken = data.resetToken || undefined;
        this.resetTokenExpiry = data.resetTokenExpiry || undefined;
    }

    validate() {
        //
    };


    get() {
        return Object.freeze({
            username: this.username,
            email: this.email,
            password: this.password,
            displayname: this.displayname,
            isVerified: this.isVerified,
            isBanned:this.isBanned,
            gender: this.gender,
            blockedUsers: this.blockedUsers,
            configuration: this.configuration,
            bio: this.bio,
            links: this.links,
            cover: this.cover,
            avatar: this.avatar,
            resetToken: this.resetToken,
            resetTokenExpiry: this.resetTokenExpiry,
        })
    }
    //  remember there are other methods like object.assign, object.keys
    //  which can achieve a similiar, but not exact behaviour.  
}