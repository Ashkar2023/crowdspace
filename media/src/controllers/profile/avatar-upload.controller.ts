import { CreateBucketCommand, PutObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { consumerEvents, encodeEventMessage, getLoggedInUserId, InternalServerError, rabbitmqConfig, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { mediaStorageConfig } from "@config/media-storage.config.js";
import { generateUrlSafeHash } from "@utils/crypto.utils.js";
import s3Api from "@services/s3.client.js";
import { publisherChannel } from "@events/index.js";

export const avatarUpload = async (req: Request) => {
    const loggedInUserId = getLoggedInUserId(req);
    const { filename, size, buffer, mimetype } = req.file as Express.Multer.File;

    const bucketName = mediaStorageConfig.buckets.avatar;
    const mediaPath = generateUrlSafeHash(loggedInUserId, filename ? filename : size.toString());


    const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: mediaPath,
        Body: buffer,
        ContentType: mimetype
    })

    try {
        const uploadPromise = s3Api.send(uploadCommand, {
            requestTimeout: 4000
        })

        const eventBody = encodeEventMessage(consumerEvents.avatar_upload_success, {
            avatar_url: `/${bucketName}/${mediaPath}`,
            user_id: loggedInUserId,
            // upload_metadata: (await uploadPromise).$metadata
        })

        const uploadResponse = await uploadPromise;

        if (uploadResponse.$metadata.httpStatusCode === 200) {
            publisherChannel.publish(
                rabbitmqConfig.exchanges.contentDirect.name,
                rabbitmqConfig.routingKeys.user.contentDirect,
                eventBody
            );
        } else {
            throw new Error(uploadResponse.$metadata.httpStatusCode?.toString());
        }

    } catch (error) {
        if(error instanceof Error){
            console.log(error.name)
            throw new InternalServerError("upload error")
        };
    }

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("avatar updation process started")
        .setData({})
        .get();
}