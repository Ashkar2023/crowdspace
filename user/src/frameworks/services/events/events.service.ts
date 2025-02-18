import { RabbitMQ, rabbitmqConfig } from "@cr0wdspace/common";

// connect
const UserMsgBroker = RabbitMQ.getInstance();

await UserMsgBroker.init(process.env.RABBITMQ_ENDPOINT!);

export const consumerChannel = await UserMsgBroker.makeChannel("consumer");
export const publisherChannel = await UserMsgBroker.makeChannel("publisher");

export const { exchanges, queues, routingKeys } = rabbitmqConfig;

await consumerChannel.assertExchange( //content exchange
    exchanges.contentDirect.name,
    exchanges.contentDirect.type,
    { durable: false }
)

await consumerChannel.assertExchange( //notification exchange
    exchanges.notificationFanout.name,
    exchanges.notificationFanout.type,
    { durable: false }
)

await consumerChannel.assertQueue(queues.user); // service queue
await consumerChannel.assertQueue(queues.chat);

await consumerChannel.bindQueue( // user -> content
    queues.user,
    exchanges.contentDirect.name,
    routingKeys.user.contentDirect
)

await consumerChannel.bindQueue( //user -> notification
    queues.user,
    exchanges.notificationFanout.name,
    routingKeys.user.notificationFanout
)

export default UserMsgBroker;

/* CHANGE the behaviour to a class based injectable */