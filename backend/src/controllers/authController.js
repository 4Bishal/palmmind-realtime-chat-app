import User from "../models/User.js";

import { generateToken } from "../utils/generateToken.js";

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


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }

        // 2. Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // 3. Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // 4. Generate token
        const token = generateToken(user._id);

        // 5. Response (no password)
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const getMe = async (req, res) => {
    res.status(200).json({
        message: "Protected route accessed",
        user: req.user,
    });
};