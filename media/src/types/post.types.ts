export enum MediaEnum {
    IMAGE = "image",
    VIDEO = "video",
    // GIF = "gif"
}

export type Media = {
    // index: number,
    media_meta: Record<string, any>, // Enhance with resolution, encoding etc
    media_url: string,
    mediaType: MediaEnum,
}