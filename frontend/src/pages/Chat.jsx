import { useEffect, useState } from "react";

import API from "../api/axios";

import UserList from "../components/UserList";

import { useAuth } from "../context/AuthContext";

function Chat() {
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await API.get("/users");

            // backend returns { success, count, users }
            const allUsers = response.data?.users || [];

            const filteredUsers = allUsers.filter((u) => u._id !== user._id);

            setUsers(filteredUsers);
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading users...
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-gray-100">
            <UserList
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />

            <div className="flex-1 flex items-center justify-center">
                {selectedUser ? (
                    <div>
                        <h2 className="text-2xl font-bold">
                            Chat with {selectedUser.username}
                        </h2>
                    </div>
                ) : (
                    <p className="text-gray-500 text-lg">
                        Select a user to start chatting
                    </p>
                )}
            </div>
        </div>
    );
}

export default Chat;