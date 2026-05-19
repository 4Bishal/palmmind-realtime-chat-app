import User from "../models/User.js";
import Message from "../models/Message.js";

/**
 * GET /api/stats
 * Returns system-level metrics
 */
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMessages = await Message.countDocuments();

        res.status(200).json({
            success: true,
            totalUsers,
            totalMessages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats",
        });
    }
};