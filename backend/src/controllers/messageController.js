import Message from "../models/Message.js";

/**
 * GET /api/messages/:userId
 * Get chat history between logged-in user and another user
 */
export const getMessages = async (req, res) => {
    try {
        const myId = req.user.id; // from JWT middleware
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 }); // oldest → newest

        res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
        });
    }
};