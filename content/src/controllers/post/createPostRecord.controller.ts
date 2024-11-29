import { PostRepoImp } from "repositories/repos.index.js";

const createPostRecord = async (message: any) => {
    try {
        const saved = await PostRepoImp.createPost(message.body);
        return saved;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
        } else {
            console.log('An unknown error occurred at creaetePostRecord');
        }
    }
}

export default createPostRecord