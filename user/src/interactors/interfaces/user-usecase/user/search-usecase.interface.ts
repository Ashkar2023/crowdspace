import { IUser } from "@entities/interfaces/user-entity.interface.js";

export interface ISearchUsecase {
    search(query: string): Promise<IUser[] | null>;
}