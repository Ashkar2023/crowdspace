import { RabbitMQ, rabbitmqConfig } from "@crowdspace/common";

const ContentMsgBroker = RabbitMQ.getInstance();

// connect
await ContentMsgBroker.init(process.env.RABBITMQ_ENDPOINT!);

export const consumerChannel = await ContentMsgBroker.makeChannel("consumer");
export const publisherChannel = await ContentMsgBroker.makeChannel("publisher");

const { exchanges, queues, routingKeys } = rabbitmqConfig;

await consumerChannel.assertExchange(
    exchanges.contentDirect.name,
    exchanges.contentDirect.type,
    { durable: false }
)

await consumerChannel.assertExchange(
    exchanges.notificationFanout.name,
    exchanges.notificationFanout.type,
    { durable: false }
)

await consumerChannel.assertQueue(queues.chat); // current service queue
await consumerChannel.assertQueue(queues.content); // for usage in service

await consumerChannel.bindQueue(
    queues.chat,
    exchanges.contentDirect.name,
    routingKeys.chat.contentDirect,
);

await consumerChannel.bindQueue( // chat queue -> fanout notification exchange
    queues.chat,
    exchanges.notificationFanout.name,
    routingKeys.chat.notificationFanout,
);

export default ContentMsgBroker;