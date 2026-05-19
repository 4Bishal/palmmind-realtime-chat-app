import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";
import chatHandler from "./handlers/chatHandler.js";

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

        chatHandler(io, socket);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.email}`);
        });
    });

    return io;
};

export default initializeSocket;