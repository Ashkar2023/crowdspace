import { Configuration, IUser, IUserEntity, Link } from "@interfaces/entity.interface";
import { Schema } from "mongoose";

export class UserImp implements IUserEntity {
    username: string;
    email: string;
    password: string;
    gender: "M" | "F";
    blockedUsers: Schema.Types.ObjectId[];
    configuration: Configuration;
    bio?: string | undefined;
    links?: Link[] | undefined;
    cover?: string | undefined;
    avatar?: string | undefined;


    constructor(data: IUser) {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.gender = data.gender;
        this.blockedUsers = data.blockedUsers;
        this.configuration = data.configuration;
        this.bio = data.bio;
        this.links = data.links;
        this.cover = data.cover;
        this.avatar = data.avatar;
    }

    validate() {

    };

    validateConfig() {

        return true
    };

    get() { 
        return Object.freeze({
            username: this.username,
            email: this.email,
            password: this.password,
            gender: this.gender,
            blockedUsers: this.blockedUsers,
            configuration: this.configuration,
            bio: this.bio,
            links: this.links,
            cover: this.cover,
            avatar: this.avatar
        })
    } 
    
    //  remember there are other methods like object.assign, object.keys
    //  which can achieve a similiar, but not exact behaviour.  
}