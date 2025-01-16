import { ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import postModel from "models/post.model.js";
import { PostRepoImp } from "repositories/repositories.index.js";

export const getDashboardDataController = async (req: Request) => {

    const postCount = await postModel.find({}).countDocuments();

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("dashboard got")
        .setData({ postCount })
        .get();
}