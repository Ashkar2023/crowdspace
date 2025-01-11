import { SocketEvents } from "@crowdspace/common";
import { Server, Socket } from "socket.io";
import { callMetadata } from "~types/call.types.js";

export const endCallAndEmit = (socket: Socket, io: Server) => {

    return async function (callData: callMetadata) { // in this controller only roomId is coming
        try {
            console.log(callData)
            socket.to(callData.roomId).emit(SocketEvents.call_ended, "call ended");

        } catch (error) {
            if (error instanceof Error) {
                socket.emit(SocketEvents.client_error, error.message);
            }
        }
    }
} 