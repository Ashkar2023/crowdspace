import { SocketEvents } from "@crowdspace/common";
import { Server, Socket } from "socket.io";
import { callMetadata } from "~types/call.types.js";

export const createCallAndEmit = (socket: Socket, io: Server) => {

    return async function (callData: callMetadata) {
        try {

            socket.join(callData.roomId);

            const parsedReceiverSocket = RetrieveCorrespondingId(callData.receiverId);

            console.table({ parsedReceiverSocket })
            if (!parsedReceiverSocket) {
                return socket.emit(SocketEvents.call_user_offline, "user offline");
            }

            io.to(parsedReceiverSocket).emit(SocketEvents.call_incoming, {
                roomId: callData.roomId,
                receiverId: callData.receiverId,
                userBasic: (
                    await (
                        await fetch(process.env.USER_SERVICE + "/basic/" + RetrieveCorrespondingId(socket.id))
                    ).json()).body // handle errors
            });

        } catch (error) {
            if (error instanceof Error) {
                socket.emit(SocketEvents.client_error, error.message);
            }
        }
    }
} 