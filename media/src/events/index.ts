import { RabbitMQ } from "@crowdspace/common";

// connect
const MediaMsgBroker = RabbitMQ.getInstance();

await MediaMsgBroker.init(process.env.RABBITMQ_ENDPOINT!);

export const consumerChannel = await MediaMsgBroker.makeChannel("consumer");
export const publisherChannel = await MediaMsgBroker.makeChannel("publisher");


await consumerChannel.assertExchange("content-exchange", "direct", { durable: false })
await consumerChannel.assertQueue("post", {});


export default MediaMsgBroker;