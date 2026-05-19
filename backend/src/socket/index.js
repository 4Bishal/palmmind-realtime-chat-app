import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";
import chatHandler from "./handlers/chatHandler.js";
import { userConnected, userDisconnected, getOnlineUsers } from "./presence.js";

const initializeSocket = (server) => {
    const clientUrl = process.env.CLIENT_URL;

    const io = new Server(server, {
        cors: {
            origin: clientUrl === "*" || !clientUrl ? "*" : clientUrl,
            credentials: true,
        },
    });

    // Authentication middleware
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.email}`);

        // JOIN USER ROOM
        socket.join(socket.user.id);

        // TRACK ONLINE USER
        userConnected(socket.user.id, socket.id);

        // Broadcast to all clients that this user is online
        const onlinePayload = { userId: socket.user.id };
        io.emit("user:online", onlinePayload);

        // Send the current online users list to the newly connected client
        const list = getOnlineUsers();
        socket.emit("online:list", list);

        chatHandler(io, socket);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.email}`);

            userDisconnected(socket.user.id);

            io.emit("user:offline", {
                userId: socket.user.id,
            });
        });
    });

    return io;
};

export default initializeSocket;