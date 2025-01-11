import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { ISearchUsecase } from "@interactors/interfaces/user-usecase/user/search-usecase.interface.js";


export class SearchImp implements ISearchUsecase {

    constructor(
        private _UserRepositoryInstance: IUserRepository,
    ) {

    }

    async search(query: string) {

        return this._UserRepositoryInstance.search(query);
    }
}

