import { RabbitMQ } from "@crowdspace/common";

const ContentMsgBroker = RabbitMQ.getInstance();

// connect
await ContentMsgBroker.init(process.env.RABBITMQ_ENDPOINT!);

export const consumerChannel = await ContentMsgBroker.makeChannel("consumer");
export const publisherChannel = await ContentMsgBroker.makeChannel("publisher");


await consumerChannel.assertExchange("content-exchange", "direct", { durable: false })
await consumerChannel.assertQueue("post", {});
await consumerChannel.bindQueue("post","content-exchange","")

export default ContentMsgBroker;