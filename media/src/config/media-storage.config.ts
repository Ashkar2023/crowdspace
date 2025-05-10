export const mediaStorageConfig = {
    bucket_folders: {
        post: "post",
        avatar:"avtr"
    },
    bucket: process.env.AWS_BUCKET_NAME as string
} as const;

// For AWS S3 only one bucket is used and these are used as folder paths not actual bucket