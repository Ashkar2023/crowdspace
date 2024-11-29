import { asyncEvents, DateForPath, encodeEventMessage, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import s3Api from "../../services/s3.client.js";
import { PutObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { publisherChannel } from "@events/index.js";
import { Media, MediaEnum } from "~types/post.types.js";

export const postMediaUpload = async (req: Request) => {

    const mediaFiles = req.files as Express.Multer.File[]; // type assertion for length property access
    const userId = req.headers["x-logged-in-user"];



    /* TO-DO: Compress medias before upload */



    const populatedMediaObjects: Media[] = [];

    for (let index = 0; index < mediaFiles.length; index++) {
        const media = mediaFiles[index];
        const mediaPath = DateForPath() + media.originalname.replace(/[^\w\-._]/g, "");
        const bucketName = "post";

        // const mediaUrl = new URL(`/${bucketName}/${mediaPath}`, process.env.MINIO_ENDPOINT);

        const uploadObject = new PutObjectCommand({
            Bucket: bucketName,
            Key: mediaPath,
            Body: media.buffer,
            ContentType: media.mimetype
        })

        try {
            const uploaded = await s3Api.send(uploadObject);

            if (uploaded.$metadata.httpStatusCode === 200) {
                populatedMediaObjects.push({
                    media_url: `/${bucketName}/${mediaPath}`,
                    media_meta: {
                        size: media.size,
                        originalName: media.originalname,
                        // POPULATE with other metadata
                    },
                    mediaType: (
                        media.mimetype.includes("image") ?
                            MediaEnum.IMAGE :
                            MediaEnum.VIDEO)
                });
            }
        } catch (error) {
            if (error instanceof S3ServiceException) {
                console.log(error);
            }
        }
    }

    const bodyObject = {
        author: userId,
        postType: req.body.postType,
        tags: req.body.tags,
        visibility: req.body.visibility,
        location: req.body.location,
        thumbnail: req.body.thumbnail,
        caption: req.body.caption,
        media: populatedMediaObjects
    }

    const dataBuffer = encodeEventMessage(
        asyncEvents.media_upload_success,
        bodyObject
    )

    const published = publisherChannel.publish("content-exchange", "", dataBuffer);

    if (!published) {
        //handle message failure
    };

    const response = new ResponseCreator();
    return response
        .setStatusCode(201)
        .setMessage("Media upload success")
        .get()
}