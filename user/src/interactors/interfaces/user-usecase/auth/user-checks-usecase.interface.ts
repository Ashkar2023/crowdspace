export interface IUserChecksUsecase {
    checkExistingUser: (email: string) => Promise<boolean>,
    usernameExists: (username: string) => Promise<boolean>,
}