import { HeadBucketCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { styleText } from "util";

const s3Api = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT,
    region:process.env.MINIO_REGION,
    forcePathStyle:true,
    credentials:{
        accessKeyId:process.env.MINIO_ACCESS!,
        secretAccessKey:process.env.MINIO_SECRET!,
    },
})

export async function pingS3() {
    try {
        const response = await s3Api.send(new HeadBucketCommand({ Bucket: "post" }))
        console.log(
            styleText("bold", "S3 status:"),
            styleText("green", "\n"+response.$metadata.httpStatusCode!.toString())
        );

    } catch (error) {
        if (error instanceof S3ServiceException) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
};

export default s3Api;