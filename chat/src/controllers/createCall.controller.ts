import { SocketEvents } from "@crowdspace/common";
import { Server, Socket } from "socket.io";
import { callMetadata } from "~types/call.types.js";

export const createCallAndEmit = (socket: Socket, io: Server) => {

    return async function (callData: callMetadata) {
        try {
            // if(io room exists)

            socket.join(callData.roomId);

            const parsedReceiverSocket = getSocketId(callData.receiverId);

            console.table({parsedReceiverSocket})
            if (!parsedReceiverSocket) {
                return socket.emit(SocketEvents.call_user_offline, "user offline");
            }

            io.to(parsedReceiverSocket).emit(SocketEvents.call_incoming, {
                roomId: callData.roomId,
                receiverId:callData.receiverId,
                userBasic: (await (await fetch(process.env.USER_SERVICE + "/basic/" + getSocketId(socket.id))).json()).body // handle errors
            });

        } catch (error) {
            if (error instanceof Error) {
                socket.emit(SocketEvents.client_error, error.message);
            }
        }
    }
} 