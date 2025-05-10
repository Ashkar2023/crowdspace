import postModel from "models/post.model.js";
import { DeleteResult, Document, HydratedDocument, Model, Types } from "mongoose";
import { IComment } from "~types/comment.types.js";
import { ILike } from "~types/like.types.js";
import { PostCreateFields, PostEnum, T_Post } from "~types/post.types.js";

class PostRepository {
    #model: Model<T_Post> = postModel;

    constructor() { }

    async createPost(postData: PostCreateFields): Promise<Document & T_Post> {
        const newPost = new this.#model({
            ...postData,
            author: new Types.ObjectId(postData.author)
        })

        return await newPost.save();
    }

    async queryUserPosts(author: string): Promise<Array<Document & T_Post>> {
        const posts = await this.#model.find({ author, postType: PostEnum.MEDIA }).sort({ createdAt: -1 })
        // .select("-_id");

        return posts
    }

    async findPost(post_id: string): Promise<HydratedDocument<T_Post> | null> {
        return await this.#model.findById(new Types.ObjectId(post_id));
    }


    async findPostByUrl(post_url: string): Promise<HydratedDocument<T_Post> | null> {
        return await this.#model.findOne({ url: post_url });
    }


    async deletePost(postId: string): Promise<DeleteResult | null> {
        return this.#model.findByIdAndDelete(new Types.ObjectId(postId));
    }

    async editPost(postId: string, updates: Partial<T_Post>): Promise<HydratedDocument<T_Post> | null> {
        return await this.#model.findByIdAndUpdate(postId, { $set: updates }, { new: true });
    }

    async getFeed(userId: string, page: number = 0): Promise<HydratedDocument<T_Post>[]> {
        // const response = await this.#model.aggregate<T_Post>([
        //     {
        //         $match: {}
        //     },
        //     {
        //         $addFields: {
        //             "like": {}
        //         }
        //     }
        // ])
        const response = await this.#model.find({}).skip((page - 1) * 5).limit(5).sort({ createdAt: -1 });

        return response
    }

    async updatePostLikeCount(postId: Types.ObjectId, action: "inc" | "dec"): Promise<HydratedDocument<T_Post> | null> {
        const increment = action === "inc" ? 1 : -1;

        return await this.#model.findByIdAndUpdate(
            postId,
            { $inc: { likesCount: increment } },
            { new: true }
        );
    }

    async updatePostCommentCount(postId: Types.ObjectId, action: "inc" | "dec"): Promise<HydratedDocument<T_Post> | null> {
        const increment = action === "inc" ? 1 : -1;

        return await this.#model.findByIdAndUpdate(
            postId,
            { $inc: { commentsCount: increment } },
            { new: true }
        );
    }
}

export default PostRepository;