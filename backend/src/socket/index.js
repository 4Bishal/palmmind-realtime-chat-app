import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";
import chatHandler from "./handlers/chatHandler.js";
import { userConnected, userDisconnected } from "./presence.js";

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

        // EMIT TO USER THEMSELVES
        io.to(socket.user.id).emit("user:online", {
            userId: socket.user.id,
        });

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