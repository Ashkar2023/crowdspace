import { consumerEvents, decodeEventMessage, rabbitmqConfig } from "@crowdspace/common";
import { consumerChannel } from "./index.js";

consumerChannel.consume(rabbitmqConfig.queues.media,
    async (message) => {
        if (!message?.content) {
            console.log("message event null");
            return
        }

        const { body, event } = decodeEventMessage(message.content);

    },
    {
        noAck: false
    }
);

