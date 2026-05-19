const onlineUsers = new Map();

export const userConnected = (userId, socketId) => {
    onlineUsers.set(userId, socketId);
};

export const userDisconnected = (userId) => {
    onlineUsers.delete(userId);
};

export const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};