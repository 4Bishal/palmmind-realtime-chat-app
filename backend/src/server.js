import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { connectDB } from "./config/db.js"

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/usersRoute.js";
import messageRoutes from "./routes/messageRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

import http from "http";
import initializeSocket from "./socket/index.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);


app.get("/", (req, res) => {
    res.send("API Running");
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;