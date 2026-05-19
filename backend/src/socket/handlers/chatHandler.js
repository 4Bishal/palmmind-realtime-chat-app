import Message from "../../models/Message.js";


const chatHandler = (io, socket) => {
    socket.on("ping", () => {
        socket.emit("pong", {
            message: "Socket authentication successful",
            user: socket.user.email,
        });
    });

    socket.on("message:send", async (data) => {
        try {
            const { receiverId, message, clientId } = data;

            // 1. Validate input
            if (!receiverId || !message) return;

            // 2. Create message in DB
            const newMessage = await Message.create({
                senderId: socket.user.id,
                receiverId,
                message,
            });

            // 3. Emit to receiver room (include clientId if provided)
            const payload = {
                _id: newMessage._id,
                clientId: clientId || undefined,
                senderId: socket.user.id,
                receiverId,
                message,
                createdAt: newMessage.createdAt ? newMessage.createdAt.toISOString() : new Date().toISOString(),
            };

            io.to(receiverId).emit("message:receive", payload);

            // 4. Also emit to sender so both sides receive the saved message
            io.to(socket.user.id).emit("message:receive", payload);

        } catch (error) {
            console.error("Message send error:", error);
        }
    });
};

export default chatHandler;