import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

import socket, { setSocketAuthToken } from "../socket/socket";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const response = await API.get("/auth/me");

            setUser(response.data);

            // Ensure the socket handshake includes the auth token before connecting
            const token = localStorage.getItem("token");
            setSocketAuthToken(token);

            socket.connect();
            socket.emit("join", response.data._id);

        } catch (error) {
            console.error(error.response?.data || error.message);

            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    // Ensure socket is connected when `user` becomes available (e.g. after login)
    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem("token");
        setSocketAuthToken(token);

        if (!socket.connected) {
            socket.connect();
        }

        // notify server to join the user's room
        socket.emit("join", user._id);
    }, [user]);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);

        // clear auth and disconnect socket on logout
        setSocketAuthToken(null);
        socket.disconnect();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}