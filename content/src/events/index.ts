import { RabbitMQ, rabbitmqConfig } from "@cr0wdspace/common";

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

await consumerChannel.assertQueue(queues.content); //current service queue
await consumerChannel.assertQueue(queues.chat);

await consumerChannel.bindQueue(
    queues.content,
    exchanges.contentDirect.name,
    routingKeys.content.contentDirect
)
await consumerChannel.bindQueue(
    queues.content,
    exchanges.notificationFanout.name,
    routingKeys.chat.notificationFanout
)

export default ContentMsgBroker;