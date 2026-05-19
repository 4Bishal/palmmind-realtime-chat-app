import { useEffect, useState } from "react";
import API from "../api/axios";

import UserList from "../components/UserList";
import MessageBox from "../components/MessageBox";

import { useAuth } from "../context/AuthContext";

import socket from "../socket/socket";

function Chat() {
    const { user } = useAuth();

    // tolerate different shapes returned by auth API
    const currentUserId =
        user?._id || user?.id || user?.user?._id || user?.data?._id || null;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const [loading, setLoading] = useState(true);

    const [onlineUsers, setOnlineUsers] = useState([]);

    // Fetch users (handle API returning either an array or an object { users })
    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");

            const all = Array.isArray(res.data)
                ? res.data
                : res.data?.users || [];

            const filtered = all.filter((u) => String(u._id) !== String(currentUserId));
            setUsers(filtered);
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch messages
    const fetchMessages = async (userId) => {
        try {
            const res = await API.get(`/messages/${userId}`);

            const all = Array.isArray(res.data)
                ? res.data
                : res.data?.messages || [];

            // normalize messages to consistent shape
            const normalized = all.map((m) => ({
                _id: String(m._id ?? m.clientId ?? Date.now()),
                senderId: m.senderId,
                receiverId: m.receiverId,
                message: m.message ?? "",
                createdAt: m.createdAt
                    ? typeof m.createdAt === "string"
                        ? m.createdAt
                        : new Date(m.createdAt).toISOString()
                    : new Date().toISOString(),
            }));

            setMessages(normalized);
        } catch (err) {
            console.error(err.response?.data || err.message);
            setMessages([]);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsers();
        } else {
            setUsers([]);
        }
    }, [user]);

    // when user selects chat
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
        } else {
            setMessages([]);
        }
    }, [selectedUser]);

    // Handled in socket section
    const sendMessage = () => {
        if (!text.trim()) return;

        const tempId = `temp_${Date.now()}`;

        const messageData = {
            _id: tempId, // temporary id for optimistic UI
            senderId: currentUserId || user._id,
            receiverId: selectedUser._id,
            message: text,
            createdAt: new Date().toISOString(),
        };

        // emit to backend including clientId so server can correlate and return real _id
        socket.emit("message:send", {
            clientId: tempId,
            receiverId: selectedUser._id,
            message: text,
        });

        // optimistic UI update
        setMessages((prev) => [...prev, messageData]);

        setText("");
    };

    // Socket listeners for online/offline users
    useEffect(() => {
        const handleUserOnline = (payload) => {
            const userId = payload?.userId || payload;
            if (!userId) return;

            setOnlineUsers((prev) => {
                if (prev.includes(userId)) return prev;
                return [...prev, userId];
            });
        };

        const handleUserOffline = (payload) => {
            const userId = payload?.userId || payload;
            if (!userId) return;

            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        };

        // initialize online users list when joining
        const handleOnlineList = (list) => {
            if (Array.isArray(list)) {
                setOnlineUsers(list);
            }
        };

        socket.on("user:online", handleUserOnline);
        socket.on("user:offline", handleUserOffline);
        socket.on("online:list", handleOnlineList);

        return () => {
            socket.off("user:online", handleUserOnline);
            socket.off("user:offline", handleUserOffline);
            socket.off("online:list", handleOnlineList);
        };
    }, []);

    // Listen for incoming messages from socket
    useEffect(() => {
        const handleMessage = (raw) => {
            // only show if message belongs to current chat (either direction)
            if (!selectedUser || !user) return;

            const sid = String(raw.senderId);
            const rid = String(raw.receiverId);
            const sel = String(selectedUser?._id);
            const me = String(currentUserId || user?._id);

            const belongsToChat = (sid === sel && rid === me) || (sid === me && rid === sel);

            if (!belongsToChat) return;

            const message = {
                _id: String(raw._id ?? raw.clientId ?? `msg_${Date.now()}`),
                senderId: raw.senderId,
                receiverId: raw.receiverId,
                message: raw.message ?? "",
                createdAt: raw.createdAt
                    ? typeof raw.createdAt === "string"
                        ? raw.createdAt
                        : new Date(raw.createdAt).toISOString()
                    : new Date().toISOString(),
            };

            setMessages((prev) => {
                // If server returned a clientId, replace any optimistic message that used temp _id
                if (raw.clientId) {
                    const idx = prev.findIndex((m) => String(m._id) === String(raw.clientId));
                    if (idx !== -1) {
                        const next = [...prev];
                        next[idx] = message;
                        return next;
                    }
                }

                // Avoid duplicate by server _id
                if (prev.some((m) => String(m._id) === String(message._id))) return prev;
                return [...prev, message];
            });
        };

        socket.on("message:receive", handleMessage);

        return () => {
            socket.off("message:receive", handleMessage);
        };
    }, [selectedUser, user]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading chat...
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-gray-100">
            {/* USERS */}
            <UserList
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                onlineUsers={onlineUsers}
            />

            {/* CHAT AREA */}
            <div className="flex flex-col flex-1">

                {selectedUser ? (
                    <>
                        {/* HEADER */}
                        <div className="p-4 border-b bg-white">
                            <h2 className="font-bold text-lg">
                                Chat with {selectedUser.username}
                            </h2>
                        </div>

                        {/* MESSAGES */}
                        <MessageBox
                            messages={messages}
                            currentUser={user}
                        />

                        {/* INPUT */}
                        <div className="p-4 border-t bg-white flex gap-2">
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                className="flex-1 border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Type a message..."
                                aria-label="Type a message"
                            />

                            <button
                                onClick={sendMessage}
                                className="bg-black text-white px-5 py-3 rounded-md hover:opacity-90"
                                aria-label="Send message"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1">
                        <p className="text-gray-500">
                            Select a user to start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;