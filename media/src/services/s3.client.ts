import { HeadBucketCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { styleText } from "node:util";

const s3Api = new S3Client({
    // endpoint: process.env.AWS_ENDPOINT,
    region:process.env.AWS_REGION,
    // forcePathStyle:true,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS!,
        secretAccessKey:process.env.AWS_SECRET!,
    },
})

export async function pingS3() {
    try {
        const response = await s3Api.send(new HeadBucketCommand({ Bucket: process.env.AWS_BUCKET_NAME }))
        console.log(
            styleText("bold", "S3 status:"),
            styleText("green", response.$metadata.httpStatusCode!.toString())
        );
        
    } catch (error) {
        if (error instanceof S3ServiceException) {
            console.log("s3 Error");
            console.log(error);
        } else {
            console.log(error);
        }
        console.log("===============")
    }
};

export default s3Api;