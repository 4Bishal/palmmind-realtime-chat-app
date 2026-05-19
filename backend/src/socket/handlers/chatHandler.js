const chatHandler = (io, socket) => {
    socket.on("ping", () => {
        socket.emit("pong", {
            message: "Socket authentication successful",
            user: socket.user.email,
        });
    });
};

export default chatHandler;