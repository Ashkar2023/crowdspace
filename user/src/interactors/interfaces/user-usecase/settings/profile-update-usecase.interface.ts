
export type T_ProfileSetting = {
    username: string, //as acc finder
    links: string[],
    bio: string,
    gender: "M" | "F" | undefined
}

export interface IProfileUpdateUsecase {
    updateProfile: (settings: T_ProfileSetting, userId: string) => Promise<T_ProfileSetting>
    updateUsername: (newUsername: string, userId: string) => Promise<string>
}