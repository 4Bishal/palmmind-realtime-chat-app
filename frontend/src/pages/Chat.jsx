import { useEffect, useState } from "react";
import API from "../api/axios";

import UserList from "../components/UserList";
import MessageBox from "../components/MessageBox";

import { useAuth } from "../context/AuthContext";

function Chat() {
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const [loading, setLoading] = useState(true);

    // Fetch users (handle API returning either an array or an object { users })
    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");

            const all = Array.isArray(res.data)
                ? res.data
                : res.data?.users || [];

            const filtered = all.filter((u) => u._id !== user._id);
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
            senderId: user._id,
            receiverId: selectedUser._id,
            message: text,
        };

        setMessages((prev) => [...prev, tempMessage]);
        setText("");
    };

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