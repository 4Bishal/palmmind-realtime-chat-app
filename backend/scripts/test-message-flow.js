import { io } from "socket.io-client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.TEST_SOCKET_URL || "http://localhost:5000";
const ARG_TOKEN_A = process.argv[2];
const ARG_TWO = process.argv[3];
const ARG_THREE = process.argv[4];
const ARG_FOUR = process.argv[5];

const TOKEN_A = ARG_TOKEN_A || process.env.TEST_SOCKET_TOKEN_A;
const TOKEN_B = ARG_THREE ? ARG_THREE : (ARG_TWO?.split(".").length === 3 ? ARG_TWO : process.env.TEST_SOCKET_TOKEN_B);
const ARG_RECEIVER_ID = ARG_THREE ? ARG_TWO || process.env.TEST_RECEIVER_ID : process.env.TEST_RECEIVER_ID;
const MESSAGE = ARG_FOUR || process.env.TEST_MESSAGE || "Hello from Client A";

if (!TOKEN_A || !TOKEN_B) {
    console.error("Usage:");
    console.error("  node scripts/test-message-flow.js <tokenA> <receiverId> <tokenB> [message]");
    console.error("  node scripts/test-message-flow.js <tokenA> <tokenB> [message]  # receiverId auto-derived from tokenB");
    console.error("Or set TEST_SOCKET_TOKEN_A, TEST_SOCKET_TOKEN_B, and optionally TEST_RECEIVER_ID in .env");
    process.exit(1);
}

let RECEIVER_ID = ARG_RECEIVER_ID;
if (!RECEIVER_ID) {
    const decoded = jwt.decode(TOKEN_B);
    if (decoded && typeof decoded === "object" && decoded.id) {
        RECEIVER_ID = decoded.id;
        console.log("Derived receiverId from tokenB:", RECEIVER_ID);
    }
}

if (!RECEIVER_ID) {
    console.error("Could not determine receiverId. Provide it as an argument or set TEST_RECEIVER_ID / include it in tokenB payload.");
    process.exit(1);
}

let clientAConnected = false;
let clientBConnected = false;

const createClient = (name, token) => {
    const socket = io(URL, {
        autoConnect: false,
        auth: { token },
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log(`${name} connected:`, socket.id);
        if (name === "ClientA") clientAConnected = true;
        if (name === "ClientB") clientBConnected = true;
        maybeSendMessage();
    });

    socket.on("connect_error", (err) => {
        console.error(`${name} connect_error:`, err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log(`${name} disconnected:`, reason);
    });

    return socket;
};

const clientA = createClient("ClientA", TOKEN_A);
const clientB = createClient("ClientB", TOKEN_B);

clientB.on("message:receive", (data) => {
    console.log("ClientB received message:", JSON.stringify(data, null, 2));
});

clientA.on("message:sent", (data) => {
    console.log("ClientA got sent confirmation:", JSON.stringify(data, null, 2));
});

clientA.on("connect_error", (err) => {
    console.error("ClientA connect_error:", err.message);
});

clientB.on("connect_error", (err) => {
    console.error("ClientB connect_error:", err.message);
});

const maybeSendMessage = () => {
    if (!clientAConnected || !clientBConnected) return;

    setTimeout(() => {
        console.log("ClientA emitting message:send to receiver", RECEIVER_ID);
        clientA.emit("message:send", {
            receiverId: RECEIVER_ID,
            message: MESSAGE,
        });
    }, 1000);
};

clientA.connect();
clientB.connect();

// Close both clients after a short grace period
setTimeout(() => {
    console.log("Closing sockets...");
    clientA.close();
    clientB.close();
    process.exit(0);
}, 20000);
