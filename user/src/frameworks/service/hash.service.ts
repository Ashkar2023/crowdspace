import { IHashService } from "@interactors/interfaces/hash.interface.js";
import bcrypt from "bcryptjs"

export class HashServiceImp implements IHashService {

    async hashPassword(password: string) {
        return (await bcrypt.hash(password, 10));
    }

    async comparePassword(password: string, hashedPassword: string) {
        return (await bcrypt.compare(password, hashedPassword));
    }
}

