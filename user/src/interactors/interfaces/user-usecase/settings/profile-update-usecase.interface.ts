
export type ProfileSettingDTO = {
    username: string, //as acc finder
    links: string[],
    bio: string,
    gender: "M" | "F" | undefined
}

export interface IProfileUpdateUsecase {
    updateProfile: (settings: ProfileSettingDTO, userId: string) => Promise<ProfileSettingDTO>
    updateUsername: (newUsername: string, userId: string) => Promise<string>
}