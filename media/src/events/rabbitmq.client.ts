// import { Channel, connect, Connection, Options } from "amqplib";

// class RabbitMQ {
//     static #instance: RabbitMQ | null = null;
//     static #connection: Connection | null = null;

//     // private consumerChannel: Channel | null = null;
//     // private publisherChannel: Channel | null = null;
//     consumerChannel: Channel | null = null;
//     publisherChannel: Channel | null = null;

//     private constructor() { }

//     /* Initialize RabbitMQ connection */
//     async init(url: string) {
//         RabbitMQ.#connection = await connect(url);
//     }

//     /* Return singleton instance of RabbitMQ */
//     static getInstance() {
//         if (RabbitMQ.#instance === null) {
//             RabbitMQ.#instance = new RabbitMQ();
//         }
//         return RabbitMQ.#instance;
//     }

//     /* Close function for RabbitMQ */
//     static async close(): Promise<void> {
//         if (RabbitMQ.#connection === null) {
//             throw new Error("RabbitMQ connection not initialized!")
//         }

//         if (RabbitMQ.#instance?.consumerChannel) {
//             RabbitMQ.#instance.consumerChannel.close()
//         }

//         if (RabbitMQ.#instance?.publisherChannel) {
//             RabbitMQ.#instance.publisherChannel.close()
//         }

//         RabbitMQ.#connection.close();
//     }

//     /* Create Publisher/Consumer channels at once */
//     async makeChannels() {
//         if (RabbitMQ.#connection === null) {
//             throw new Error("RabbitMQ connection not initialized!")
//         }

//         this.consumerChannel = await RabbitMQ.#connection.createChannel();
//         this.publisherChannel = await RabbitMQ.#connection.createChannel();
//     }

//     // async assertExchange(queue: string, routingKey: string, options: Options.AssertQueue) {
//     //     if(!this.publisherChannel){
//     //         this.makeChannels();
//     //     }

//     //     publisher

//     // }

//     // async publishToQueue(exchange:string){

//     // }

//     // async consumeQueue(queue: string, onMessage: (...args: any[]) => void) {

//     // }
// }

// export default RabbitMQ;