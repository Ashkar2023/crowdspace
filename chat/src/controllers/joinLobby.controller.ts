import { SocketEvents } from "@cr0wdspace/common";
import { Server, Socket } from "socket.io";

export const joinLobby = (socket: Socket, io: Server) => {

    return async function ({ roomId, joineeId }: { joineeId: string, roomId: string }) {
        try {
            socket.join(roomId);
            const response = await socket.to(roomId).timeout(2000).emitWithAck(SocketEvents.call_user_joined_lobby, { joineeId });
            console.log(response.status && "user joined lobby");

        } catch (error) {
            if (error instanceof Error) {
                socket.to(roomId).emit(SocketEvents.client_error,"join lobby acknowledge failed");
                console.log(error.message);
            }
        }

    }
}