import postModel from "models/post.model.js";
import { DeleteResult, Document, HydratedDocument, Model, Types } from "mongoose";
import { IComment } from "~types/comment.types.js";
import { PostCreateFields, T_Post } from "~types/post.types.js";

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

    async queryUserPosts(userUUID: string): Promise<Array<Document & T_Post>> {
        const posts = await this.#model.find({ author: userUUID }).sort({ createdAt: -1 })
        // .select("-_id");

        return posts
    }

    async findPost(postUUID: string): Promise<HydratedDocument<T_Post> | null> {
        return await this.#model.findById(new Types.ObjectId(postUUID)); //later Change to findOne for UUID based query  
    }


    async deletePost(postId: string): Promise<DeleteResult | null> {
        return this.#model.findByIdAndDelete(new Types.ObjectId(postId));
    }
}

export default PostRepository;