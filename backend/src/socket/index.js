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

        // TRACK ONLINE USER (support multiple sockets per user)
        const connectedCount = userConnected(socket.user.id, socket.id);

        // Broadcast to all clients that this user is online only if this is their first socket
        if (connectedCount === 1) {
            io.emit("user:online", { userId: socket.user.id });
        }

        // Send the current online users list to the newly connected client
        const list = getOnlineUsers();
        socket.emit("online:list", list);

        chatHandler(io, socket);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.email}`);

            const remaining = userDisconnected(socket.user.id, socket.id);

            // Only broadcast offline when no sockets remain for this user
            if (remaining === 0) {
                io.emit("user:offline", {
                    userId: socket.user.id,
                });
            }
        });
    });

    return io;
};

export default initializeSocket;