import { asyncEvents, decodeEventMessage } from "@crowdspace/common";
import { consumerChannel } from "./index.js";

consumerChannel.consume("post",
    async (event) => {
        if (!event) {
            throw new Error("Event from Post queue Null/Undefined");
        }

        /* CREATE DTO for types (IMPORTANT) */
        const message = decodeEventMessage(event?.content!);

        if (message.event === asyncEvents.post_deleted) {
            message.mediaUrls.forEach((media_url: string) => {
                console.log(media_url);
                //FINISH
            });
        }
    },
    {
        noAck: false
    }
);

