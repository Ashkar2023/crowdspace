import { Document, Types } from "mongoose"

export interface ILike {
    author: Types.ObjectId,
    post_id: Types.ObjectId,
}