import express from "express";
import { Server } from "socket.io";
import http from "http";
import ChatRouter from "routes/chat.routes.js";
import { globalErrorHadler, SocketEvents } from "@crowdspace/common";
import writeMessage from "@controllers/writeMessages.controller.js";
import { connect } from "mongoose";
import { connectRedis } from "services/redis.client.js";
import { instrument } from "@socket.io/admin-ui";
import { createCallAndEmit } from "@controllers/createCall.controller.js";
import { declineCall } from "@controllers/declineCall.controller.js";
import { acceptCall } from "@controllers/acceptCall.controller.js";
import { RTC_Answer_handler, RTC_Offer_handler } from "@controllers/rtcOfferControllers.js";
import { exchangeIceCandidates } from "@controllers/rtcIceCandidates.controller.js";
import { joinLobby } from "@controllers/joinLobby.controller.js";

const app = express();
const httpServer = new http.Server(app);


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        maxAge: 3600,
        methods: ["GET"]
    },
    path: '/socket/chat'
});


; (async function () {
    connect(process.env.DB_URL!)
        .then(result => {
            console.log("chat DB connected");
        })
        .catch(error => {
            console.log("chat DB => " + error.message);
        })
})();

await connectRedis();



const onlineUsersMap: { [key: string]: string } = {};

declare global {
    var getSocketId: (userId: string) => string
}

global.getSocketId = (userId: string): string => {
    return onlineUsersMap[userId];
}


io.on("connect", (socket) => {
    const userId = socket.handshake.auth.userId;
    console.log(userId, socket.id);

    onlineUsersMap[userId] = socket.id;
    onlineUsersMap[socket.id] = userId;

    //Events 
    socket.on(SocketEvents.send_msg, writeMessage(socket, io));

    socket.on(SocketEvents.call_create, createCallAndEmit(socket, io));

    socket.on(SocketEvents.call_user_join_lobby, joinLobby(socket, io));
    
    socket.on(SocketEvents.call_join, acceptCall(socket, io));
    
    socket.on(SocketEvents.call_decline, declineCall(socket, io));

    socket.on(SocketEvents.rtc_offer_send, RTC_Offer_handler(socket, io));

    socket.on(SocketEvents.rtc_answer_send, RTC_Answer_handler(socket, io));

    socket.on(SocketEvents.rtc_ice_candidates, exchangeIceCandidates(socket, io));


    //Disconnect
    socket.on("disconnect", (reason, description) => {
        console.log("reason", reason, "\t", description);

        console.log(socket.rooms);

        const userId = onlineUsersMap[socket.id];
        delete onlineUsersMap[userId];
        delete onlineUsersMap[socket.id];
    })
})

instrument(io, {
    auth: false,
    mode: "development",
    namespaceName: "/admin"
});

httpServer.listen(process.env.PORT, () => {
    console.log("Chat Socket server started");
})

setTimeout(() => {
    console.log("---------USERID---------|----------SOCKET_ID------")
}, 1000);


app.use("/chats", ChatRouter);

app.use(globalErrorHadler);