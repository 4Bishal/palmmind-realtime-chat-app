import jwt from "jsonwebtoken";
import User from "../models/User.js";

const socketAuth = async (socket, next) => {
    try {
        // Accept token from multiple locations for easier testing:
        // 1. socket.handshake.auth.token (recommended)
        // 2. socket.handshake.query.token (fallback for tools that use query)
        // 3. Authorization header: 'Bearer <token>'
        let token = socket.handshake.auth?.token || socket.handshake.query?.token;

        if (!token) {
            const authHeader = socket.handshake.headers?.authorization || socket.handshake.headers?.Authorization;
            if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7).trim();
            }
        }

        if (!token) {
            console.warn('Socket auth: token not provided in auth, query, or headers', {
                auth: socket.handshake.auth,
                query: socket.handshake.query,
                headers: Object.keys(socket.handshake.headers || {}),
            });
            return next(new Error('Authentication token missing'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(new Error('User not found'));
        }

        socket.user = {
            id: user._id.toString(),
            email: user.email,
        };

        next();
    } catch (error) {
        console.error('Socket auth error:', error.message);
        next(new Error('Authentication failed'));
    }
};

export default socketAuth;