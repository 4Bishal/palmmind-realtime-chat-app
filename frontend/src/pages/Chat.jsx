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

            setMessages(all);
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
        }
    }, [selectedUser]);

    // Handled in socket section
    const sendMessage = () => {
        if (!text.trim()) return;

        const tempMessage = {
            _id: Date.now(),
            senderId: currentUserId || user._id,
            receiverId: selectedUser._id,
            message: text,
        };

        setMessages((prev) => [...prev, tempMessage]);
        setText("");
    };

    // Socket listeners for online/offline users
    useEffect(() => {
        socket.on("user:online", (payload) => {
            const userId = payload?.userId || payload;
            if (!userId) return;

            setOnlineUsers((prev) => {
                if (prev.includes(userId)) return prev;
                return [...prev, userId];
            });
        });

        socket.on("user:offline", (payload) => {
            const userId = payload?.userId || payload;
            if (!userId) return;

            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        });

        // initialize online users list when joining
        socket.on("online:list", (list) => {
            if (Array.isArray(list)) {
                setOnlineUsers(list);
            }
        });

        return () => {
            socket.off("user:online");
            socket.off("user:offline");
            socket.off("online:list");
        };
    }, []);

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
                                className="flex-1 border p-2 rounded"
                                placeholder="Type a message..."
                            />

                            <button
                                onClick={sendMessage}
                                className="bg-black text-white px-4 py-2 rounded"
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