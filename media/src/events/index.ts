import { RabbitMQ, rabbitmqConfig } from "@cr0wdspace/common";

// connect
const MediaMsgBroker = RabbitMQ.getInstance();

await MediaMsgBroker.init(process.env.RABBITMQ_ENDPOINT!);

export const consumerChannel = await MediaMsgBroker.makeChannel("consumer");
export const publisherChannel = await MediaMsgBroker.makeChannel("publisher");

const { exchanges, queues, routingKeys } = rabbitmqConfig;

await consumerChannel.assertExchange(
    exchanges.contentDirect.name,
    exchanges.contentDirect.type,
    { durable: false }
)

await consumerChannel.assertQueue(queues.media); // current service queue

export default MediaMsgBroker;