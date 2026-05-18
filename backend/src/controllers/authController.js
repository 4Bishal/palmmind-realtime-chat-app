import User from "../models/User.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Basic validation (first defensive layer)
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // 3. Create user (password auto-hashed via model hook)
        const user = await User.create({
            username,
            email,
            password,
        });

        // 4. NEVER return password
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};