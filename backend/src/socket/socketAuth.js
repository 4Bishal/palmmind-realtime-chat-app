import jwt from "jsonwebtoken";
import User from "../models/User.js";

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.query?.token;

        if (!token) {
            return next(new Error("Authentication token missing"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = user;

        next();
    } catch (error) {
        next(new Error("Authentication failed"));
    }
};

export default socketAuth;