import { asyncEvents, decodeEventMessage } from "@crowdspace/common";
import { consumerChannel } from "./index.js";
import { PostRepoImp } from "repositories/repos.index.js";

consumerChannel.consume("post",
    async (event) => {
        if (!event) {
            throw new Error("Event from Post queue Null/Undefined");
        }

        /* CREATE DTO for types (IMPORTANT) */
        const message = decodeEventMessage(event?.content!);

        if (message.event === asyncEvents.media_upload_success) {
            const result = await PostRepoImp.createPost(message.body);
            consumerChannel.ack(event)
        }

    },
    {
        noAck: false
    }
);

