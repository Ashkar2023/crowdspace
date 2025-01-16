import { SocketEvents } from "@cr0wdspace/common";
import { Server, Socket } from "socket.io";

export const declineCall = (socket: Socket, io: Server) => {

    return async function (roomId: string) {
        try {
            socket.to(roomId).emit(SocketEvents.call_user_declined,"call declined");

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }

        io.socketsLeave(roomId);
    }
}