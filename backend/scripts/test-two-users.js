import { io } from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.TEST_SOCKET_URL || "http://localhost:5000";
const TOKEN_A = process.argv[2] || process.env.TEST_SOCKET_TOKEN_A;
const TOKEN_B = process.argv[3] || process.env.TEST_SOCKET_TOKEN_B;

if (!TOKEN_A || !TOKEN_B) {
    console.error("Usage: node scripts/test-two-users.js <tokenA> <tokenB>");
    console.error("Or set TEST_SOCKET_TOKEN_A and TEST_SOCKET_TOKEN_B in .env");
    process.exit(1);
}

const createClient = (name, token) => {
    const socket = io(URL, {
        autoConnect: false,
        auth: { token },
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log(`${name} connected`, socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error(`${name} connect_error:`, err.message);
    });

    socket.on("user:online", (data) => {
        console.log(`${name} ONLINE EVENT:`, data);
    });

    socket.on("user:offline", (data) => {
        console.log(`${name} OFFLINE EVENT:`, data);
    });

    socket.on("disconnect", (reason) => {
        console.log(`${name} disconnected:`, reason);
    });

    return socket;
};

const clientA = createClient("ClientA", TOKEN_A);
const clientB = createClient("ClientB", TOKEN_B);

clientA.connect();
clientB.connect();


setTimeout(() => {
    console.log("Closing Clients B")
    clientB.close();
}, 2000)

setTimeout(() => {
    console.log("Closing  clients A");
    clientA.close();
    process.exit(0);
}, 20000);
