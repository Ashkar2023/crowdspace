import { SocketEvents } from "@crowdspace/common";
import { Server, Socket } from "socket.io";

export const RTC_Offer_handler = (socket: Socket, io: Server) => {

    return async function ({ offer, roomId }: { offer: string, roomId: string }) {
        try {

            socket.to(roomId).emit(SocketEvents.rtc_offer_receive, { offer, roomId }); // dont parse the json

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }

    }
}

export const RTC_Answer_handler = (socket: Socket, io: Server) => {

    return async function ({ answer, roomId }: { answer: string, roomId: string }) {
        try {

            socket.to(roomId).emit(SocketEvents.rtc_answer_receive, { answer, roomId });

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }

    }
}