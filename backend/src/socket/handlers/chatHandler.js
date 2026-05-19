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
            const { receiverId, message } = data;

            // 1. Validate input
            if (!receiverId || !message) return;

            // 2. Create message in DB
            const newMessage = await Message.create({
                senderId: socket.user.id,
                receiverId,
                message,
            });

            // 3. Emit to receiver room
            io.to(receiverId).emit("message:receive", {
                _id: newMessage._id,
                senderId: socket.user.id,
                receiverId,
                message,
                createdAt: newMessage.createdAt,
            });

            // 4. Optional: send back confirmation to sender
            socket.emit("message:sent", newMessage);

        } catch (error) {
            console.error("Message send error:", error);
        }
    });
};

export default chatHandler;