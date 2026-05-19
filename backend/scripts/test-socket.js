import { io } from "socket.io-client";
import dotenv from 'dotenv'


dotenv.config();

// Replace with your server URL and a valid JWT
const URL = process.env.TEST_SOCKET_URL || "http://localhost:5000";
const TOKEN = process.env.TEST_SOCKET_TOKEN || "<YOUR_JWT>";

// Create socket without auto-connecting so we can attach listeners first
const socket = io(URL, {
    autoConnect: false,
    auth: { token: TOKEN },
    transports: ["websocket"],
});

console.log('TEST SOCKET DEBUG - URL:', URL);
console.log('TEST SOCKET DEBUG - TOKEN (first 20 chars):', TOKEN && TOKEN !== '<YOUR_JWT>' ? TOKEN.slice(0, 20) + '...' : TOKEN);

// Attach listener before connecting to avoid missing immediate emits
socket.on("user:online", (data) => {
    console.log("ONLINE EVENT:", data);
});

socket.on("user:offline", (data) => {
    console.log("OFFLINE EVENT:", data)
})

socket.on("connect", () => {
    console.log("connected", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("connect_error:", err.message);
});

// Now connect
socket.connect();

// Keep process alive for a short time to receive events
setTimeout(() => {
    socket.close();
    process.exit(0);
}, 5000);
