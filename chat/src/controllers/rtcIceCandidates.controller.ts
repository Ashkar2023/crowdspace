import { SocketEvents } from "@cr0wdspace/common";
import { Server, Socket } from "socket.io";

export const exchangeIceCandidates = (socket: Socket, io: Server) => {

    return async function ({ candidate, roomId }: { candidate: string, roomId: string }) {
        try {
            socket.to(roomId).emit(SocketEvents.rtc_ice_candidates, { candidate: candidate });

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }

    }
}