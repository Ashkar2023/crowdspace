import { BadRequestError, cleanObject, DatabaseOpError, ResponseCreator } from '@crowdspace/common';
import { Request } from 'express';
import { HydratedDocument } from 'mongoose';
import { PostRepoImp } from 'repositories/index.repositories.js';
import { T_Post } from '~types/post.types.js';

export const editPost = async (req: Request) => {
    const { postId } = req.params;
    const {
        visibility,
        tags,
        archived,
        caption,
        location,
        mentions,
    } = req.body as Partial<T_Post>; // Destructured for ensuring other non editable data's (Ex: author) wouldn't enter the database
    const loggedInUser = req.headers["x-logged-in-user"];

    /* SANITIZE DATA */

    /* VALIDATE DATA */

    const post = await PostRepoImp.findPost(postId);
    let updated = null;

    if (post?.author.toString() === loggedInUser) {
        updated = await PostRepoImp.editPost(postId, cleanObject(
            {
                visibility,
                tags,
                archived,
                caption,
                location,
                mentions
            }
        ));
    } else {
        throw new BadRequestError("permission denied");
    }

    if (!post) throw new BadRequestError("invalid post");
    if (!updated) throw new DatabaseOpError("post update failed");

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("post updated")
        .setData({ updatedPost: updated.toObject() })
        .get();
};