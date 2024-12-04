import { BadRequestError } from "@crowdspace/common";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { credentialType, IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { T_ProfileSetting } from "@interactors/interfaces/user-usecase/settings/profile-update-usecase.interface.js";
import { HydratedDocument, Model, Types } from "mongoose";



export class UserRepositoryImp implements IUserRepository {
    private model: Model<IUser>;

    constructor(userModel: Model<IUser>) {
        this.model = userModel;
    }

    async insertUser(user: IUser) {
        return await this.model.create(user);
    }

    // computed property [type] for reusable code
    async findUser(
        credential: string,
        type: credentialType = "email",
        select: string = "-_id"
    ) {
        // check type param is email | username before query
        return await this.model.findOne({ [type]: credential }).select(select);
    }

    async verifyUser(email: string) {
        return await this.model.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true });
    }


    async updateProfileDetails(details: T_ProfileSetting) {
        const user = await this.model.findOne({ username: details.username });

        if (!user) throw new BadRequestError("User not found", 400);

        // removed username updation was unnecesary here
        user.bio = details.bio;
        user.links = details.links.length ? details.links : user.links;
        user.gender = details.gender;

        const updatedUser = await user.save()

        return {
            username: updatedUser.username,
            bio: updatedUser.bio || "",
            links: updatedUser.links || [],
            gender: updatedUser.gender
        }
    };


    async findUserById(userId: string, select: string = "-_id") {
        return await this.model.findById(userId).select(select);
    }


    async updatePassword(email: string, password: string) {
        return await this.model.updateOne({ email }, { $set: { password } });
    }


    async updateUsername(userId: string, newUsername: string) {
        return await this.model.updateOne(
            {
                _id: new Types.ObjectId(userId)
            },
            {
                $set: { username: newUsername }
            }
        )
    }

    // add if the user follows or not
    async getProfile(username: string) {
        return await this.model.findOne({ username }).select([
            "username",
            "displayname",
            "gender",
            "followersCount",
            "followingsCount",
            // "configurations", set privateAccount on top level fields in document
            "postsCount",
            "bio",
            "links",
            "cover",
            "avatar",
            "_id",
        ]);
    };

}