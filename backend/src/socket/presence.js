const onlineUsers = new Map(); // userId -> Set(socketId)

export const userConnected = (userId, socketId) => {
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    const sockets = onlineUsers.get(userId);
    sockets.add(socketId);
    return sockets.size;
};

export const userDisconnected = (userId, socketId) => {
    const sockets = onlineUsers.get(userId);
    if (!sockets) return 0;
    sockets.delete(socketId);
    if (sockets.size === 0) {
        onlineUsers.delete(userId);
        return 0;
    }
    return sockets.size;
};

export const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};