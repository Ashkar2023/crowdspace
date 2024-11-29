import { Types } from "mongoose"

/* SUB TYPES */

export enum MediaEnum {
    IMAGE = "image",
    VIDEO = "video",
    // GIF = "gif"
}

export enum PostEnum {
    MEDIA = "media",
    TEXT = "text"
    // POLL = "poll",
}

export enum PostStatus {
    PENDING = "pending",
    REMOVED_BY_ADMIN = "removed_by_admin",
    DELETED = "deleted",
    ACTIVE = "active"
}

export enum PostVisibilty {
    EVERYONE = "everyone",
    FOLLOWERS_ONLY = "followers_only"
}

export type Media = {
    // index: number,
    media_meta: Record<string, any>, // Enhance with resolution, encoding etc
    media_url: string,
    mediaType: MediaEnum,
}

export type GeoPoint = {
    type: "Point",
    coordinates: number[],
    index: "2dsphere",
}

/* REQUIRED POST FIELDs */
export type PostCreateFields = {
    author: Types.ObjectId,
    postType: PostEnum,
    caption: string,
    tags: string[],
    media: Media[],
    visibility: PostVisibilty,
    thumbnail?: string
    mentions: Types.ObjectId[],
}

/* PARENT POST TYPE */

export type T_Post = {
    archived: boolean,
    likesCount: number,
    commentsCount: number,
    shareCount: number,
    location?: GeoPoint,
    status: PostStatus,
    viewsCount: number
    
} & PostCreateFields;
