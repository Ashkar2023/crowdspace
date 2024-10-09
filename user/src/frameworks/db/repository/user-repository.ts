import { BadRequestError } from "@crowdspace/common";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { credentialType, IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { ProfileSettingDTO } from "@interactors/interfaces/settings/profile-update-usecase.interface.js";
import { Model, Types } from "mongoose";



export class userRepositoryImp implements IUserRepository {
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


    async updateProfileDetails(details: ProfileSettingDTO) {
        const user = await this.model.findOne({ username: details.username });

        if (!user) throw new BadRequestError("User not found", 400);

        user.username = details.username;
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
}