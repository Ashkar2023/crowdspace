import express from "express";
import { Server } from "socket.io"
import http from "http"
import cors from "cors";
import ChatRouter from "routes/chat.routes.js";
import { globalErrorHadler, SocketEvents } from "@crowdspace/common";
import writeMessage from "@controllers/writeMessages.controller.js";
import { connect } from "mongoose";
import { connectRedis } from "services/redis.client.js";
import { instrument } from "@socket.io/admin-ui";

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

    const writeMessageHandler = writeMessage(socket, io);
    socket.on(SocketEvents.send_msg, writeMessageHandler);


    socket.on("disconnect", (reason, description) => {
        console.log("reason", reason, "\t", description);

        const userId = onlineUsersMap[socket.id];
        delete onlineUsersMap[userId];
        delete onlineUsersMap[socket.id];
    })
})

instrument(io, {
    auth: false,
    mode: "development",
    namespaceName:"/admin"
});

httpServer.listen(process.env.PORT, () => {
    console.log("Chat Socket server started");
})

setTimeout(() => {
    console.log("---------USERID---------|----------SOCKET_ID------")
}, 1000);


app.use("/chats", ChatRouter);

app.use(globalErrorHadler);