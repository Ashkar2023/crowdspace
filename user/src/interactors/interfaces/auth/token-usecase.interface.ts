export interface ITokenUsecase {
    decodeToken: (jwt: string) => Record<string, any>; //Change to JWTPayload if possible
}