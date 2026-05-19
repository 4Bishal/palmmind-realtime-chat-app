import User from "../models/User.js";

/**
 * GET /api/users
 * Protected route
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};


/**
 * GET /api/users/:id
 * Get single user by id (protected)
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
};


/**
 * PUT /api/users/:id
 * Update user (only the user themselves may update their account)
 */
export const updateUser = async (req, res) => {
    try {
        const targetId = req.params.id;

        // Authorization: only allow owner to update their profile
        if (String(req.user?.id) !== String(targetId)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        const user = await User.findById(targetId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update allowed fields
        if (req.body.username) user.username = req.body.username;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password; // will be hashed in pre-save hook

        await user.save();

        const safeUser = await User.findById(targetId).select("-password");

        res.status(200).json({ success: true, user: safeUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update user" });
    }
};


/**
 * DELETE /api/users/:id
 * Delete user (only the user themselves may delete their account)
 */
export const deleteUser = async (req, res) => {
    try {
        const targetId = req.params.id;

        if (String(req.user?.id) !== String(targetId)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        await User.findByIdAndDelete(targetId);

        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};