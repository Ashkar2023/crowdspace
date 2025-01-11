import { Document, Schema, Types } from 'mongoose';

export interface IComment {
    post_id: Types.ObjectId;
    author: Types.ObjectId;
    commentBody: string;
    replyFor?: Types.ObjectId;
    edited?: boolean
}
