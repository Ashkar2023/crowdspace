import { SocketEvents } from "@crowdspace/common";
import { Server, Socket } from "socket.io";

export const acceptCall = (socket: Socket, io: Server) => {

    return async function (roomId: string, cb: Function) {
        try {

            const response = await socket.to(roomId)
                .timeout(2000)
                .emitWithAck(SocketEvents.call_user_joined, {
                    roomId,
                    receiverId: socket.handshake.auth.userId
                });

            if (response[0].status) { // serverside it comes as array, in browser as normal object
                cb({
                    status: true,
                    message: "joined room & acknowledged",
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }

    }
}