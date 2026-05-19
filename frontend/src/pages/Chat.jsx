import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import socket from "../socket/socket";
import { styles, globalCSS } from "./chatStyles";

/* ─── tiny inline components ─── */

function Avatar({ name = "?", online = false, size = 36 }) {
    const initial = name.charAt(0).toUpperCase();
    const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
        <span style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: size,
            height: size,
            borderRadius: "50%",
            background: `hsl(${hue},30%,88%)`,
            color: `hsl(${hue},40%,35%)`,
            fontSize: size * 0.4,
            fontWeight: 600,
            flexShrink: 0,
            fontFamily: "'DM Sans', sans-serif",
        }}>
            {initial}
            {online && (
                <span style={{
                    position: "absolute",
                    bottom: 1,
                    right: 1,
                    width: size * 0.28,
                    height: size * 0.28,
                    borderRadius: "50%",
                    background: "#4ade80",
                    border: "2px solid #fff",
                }} />
            )}
        </span>
    );
}

function Timestamp({ iso }) {
    if (!iso) return null;
    const d = new Date(iso);
    return (
        <span style={{ fontSize: "0.675rem", color: "#b5b0a6", marginTop: 2, flexShrink: 0 }}>
            {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
    );
}

/* ─── logout icon (SVG) ─── */

function LogoutIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

/* ─── main component ─── */

function Chat() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const currentUserId = user?._id || user?.id || user?.user?._id || user?.data?._id || null;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () =>
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => { scrollToBottom(); }, [messages]);

    /* ── fetch users ── */
    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");
            const all = Array.isArray(res.data) ? res.data : res.data?.users || [];
            setUsers(all.filter((u) => String(u._id) !== String(currentUserId)));
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── fetch messages ── */
    const fetchMessages = async (userId) => {
        try {
            const res = await API.get(`/messages/${userId}`);
            const all = Array.isArray(res.data) ? res.data : res.data?.messages || [];
            setMessages(
                all.map((m) => ({
                    _id: String(m._id ?? m.clientId ?? Date.now()),
                    senderId: m.senderId,
                    receiverId: m.receiverId,
                    message: m.message ?? "",
                    createdAt: m.createdAt
                        ? typeof m.createdAt === "string" ? m.createdAt : new Date(m.createdAt).toISOString()
                        : new Date().toISOString(),
                }))
            );
        } catch {
            setMessages([]);
        }
    };

    useEffect(() => { if (user) fetchUsers(); else setUsers([]); }, [user]);
    useEffect(() => {
        if (selectedUser) fetchMessages(selectedUser._id);
        else setMessages([]);
    }, [selectedUser]);

    /* ── send message ── */
    const sendMessage = () => {
        if (!text.trim()) return;
        const tempId = `temp_${Date.now()}`;
        socket.emit("message:send", { clientId: tempId, receiverId: selectedUser._id, message: text });
        setMessages((prev) => [...prev, {
            _id: tempId,
            senderId: currentUserId || user._id,
            receiverId: selectedUser._id,
            message: text,
            createdAt: new Date().toISOString(),
        }]);
        setText("");
        inputRef.current?.focus();
    };

    /* ── handle logout ── */
    const handleLogout = () => {
        if (typeof logout === "function") logout();
        navigate("/login");
    };

    /* ── socket: online / offline ── */
    useEffect(() => {
        const onOnline = (p) => {
            const id = p?.userId || p;
            if (id) setOnlineUsers((prev) => prev.includes(id) ? prev : [...prev, id]);
        };
        const onOffline = (p) => {
            const id = p?.userId || p;
            if (id) setOnlineUsers((prev) => prev.filter((x) => x !== id));
        };
        const onList = (list) => { if (Array.isArray(list)) setOnlineUsers(list); };

        socket.on("user:online", onOnline);
        socket.on("user:offline", onOffline);
        socket.on("online:list", onList);
        return () => {
            socket.off("user:online", onOnline);
            socket.off("user:offline", onOffline);
            socket.off("online:list", onList);
        };
    }, []);

    /* ── socket: incoming messages ── */
    useEffect(() => {
        const handle = (raw) => {
            if (!selectedUser || !user) return;
            const sid = String(raw.senderId), rid = String(raw.receiverId);
            const sel = String(selectedUser._id), me = String(currentUserId || user._id);
            if (!((sid === sel && rid === me) || (sid === me && rid === sel))) return;

            const msg = {
                _id: String(raw._id ?? raw.clientId ?? `msg_${Date.now()}`),
                senderId: raw.senderId,
                receiverId: raw.receiverId,
                message: raw.message ?? "",
                createdAt: raw.createdAt
                    ? typeof raw.createdAt === "string" ? raw.createdAt : new Date(raw.createdAt).toISOString()
                    : new Date().toISOString(),
            };

            setMessages((prev) => {
                if (raw.clientId) {
                    const idx = prev.findIndex((m) => String(m._id) === String(raw.clientId));
                    if (idx !== -1) { const n = [...prev]; n[idx] = msg; return n; }
                }
                if (prev.some((m) => String(m._id) === String(msg._id))) return prev;
                return [...prev, msg];
            });
        };

        socket.on("message:receive", handle);
        return () => socket.off("message:receive", handle);
    }, [selectedUser, user]);

    const onlineCount = onlineUsers.length;
    const displayName = user?.username || user?.user?.username || "You";

    /* ── loading state ── */
    if (loading) {
        return (
            <div style={styles.loadingWrap}>
                <span style={styles.loadingDot} />
            </div>
        );
    }

    /* ── render ── */
    return (
        <>
            <style>{globalCSS}</style>

            <div style={styles.root}>

                {/* ──────────── SIDEBAR ──────────── */}
                <aside style={{ ...styles.sidebar, ...(sidebarOpen ? {} : styles.sidebarHidden) }}>

                    {/* Brand */}
                    <div style={styles.brand}>
                        <span style={styles.brandName}>Ping</span>
                        <span style={styles.brandOnline}>
                            <span style={styles.onlineDot} />
                            {onlineCount} online
                        </span>
                    </div>

                    {/* Section label */}
                    <p style={styles.sectionLabel}>Messages</p>

                    {/* User list */}
                    <div style={styles.userScroll}>
                        {users.length === 0 && (
                            <p style={styles.emptyNote}>No other users yet</p>
                        )}
                        {users.map((u) => {
                            const isOnline = onlineUsers.map(String).includes(String(u._id));
                            const isActive = selectedUser?._id === u._id;
                            return (
                                <div
                                    key={u._id}
                                    className={`user-row${isActive ? " active" : ""}`}
                                    onClick={() => { setSelectedUser(u); setSidebarOpen(false); }}
                                >
                                    <Avatar name={u.username} online={isOnline} />
                                    <div style={{ minWidth: 0 }}>
                                        <p style={styles.userName}>{u.username}</p>
                                        <p style={styles.userStatus}>{isOnline ? "Active now" : "Offline"}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer — avatar + name + logout */}
                    <div style={styles.sidebarFooter}>
                        <Avatar name={displayName} size={30} />
                        <span style={styles.footerName}>{displayName}</span>
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                        >
                            <LogoutIcon />
                        </button>
                    </div>
                </aside>

                {/* ──────────── MAIN ──────────── */}
                <main style={styles.main}>
                    {selectedUser ? (
                        <>
                            {/* Chat header */}
                            <div style={styles.chatHeader}>
                                <button
                                    style={styles.backBtn}
                                    onClick={() => { setSelectedUser(null); setSidebarOpen(true); }}
                                    aria-label="Back"
                                >
                                    ←
                                </button>
                                <Avatar
                                    name={selectedUser.username}
                                    online={onlineUsers.map(String).includes(String(selectedUser._id))}
                                    size={34}
                                />
                                <div>
                                    <p style={styles.chatHeaderName}>{selectedUser.username}</p>
                                    <p style={styles.chatHeaderStatus}>
                                        {onlineUsers.map(String).includes(String(selectedUser._id))
                                            ? "Active now"
                                            : "Offline"}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={styles.messagesArea}>
                                {messages.length === 0 && (
                                    <div style={styles.emptyChat}>
                                        <p style={styles.emptyChatTitle}>Start the conversation</p>
                                        <p style={styles.emptyChatSub}>Say hello to {selectedUser.username}</p>
                                    </div>
                                )}
                                {messages.map((msg, i) => {
                                    const isMine = String(msg.senderId) === String(currentUserId || user?._id);
                                    const prevMsg = messages[i - 1];
                                    const sameGroup = prevMsg && String(prevMsg.senderId) === String(msg.senderId);
                                    return (
                                        <div
                                            key={msg._id}
                                            style={{
                                                display: "flex",
                                                flexDirection: isMine ? "row-reverse" : "row",
                                                alignItems: "flex-end",
                                                gap: "0.5rem",
                                                marginTop: sameGroup ? "0.2rem" : "0.9rem",
                                            }}
                                        >
                                            {!isMine && (
                                                <span style={{ opacity: sameGroup ? 0 : 1 }}>
                                                    <Avatar name={selectedUser.username} size={26} />
                                                </span>
                                            )}
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: isMine ? "flex-end" : "flex-start",
                                            }}>
                                                <div className={`msg-bubble ${isMine ? "mine" : "theirs"}`}>
                                                    {msg.message}
                                                </div>
                                                {!sameGroup && <Timestamp iso={msg.createdAt} />}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input area */}
                            <div style={styles.inputArea}>
                                <input
                                    ref={inputRef}
                                    className="chat-input"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder={`Message ${selectedUser.username}…`}
                                    aria-label="Type a message"
                                />
                                <button
                                    className="send-btn"
                                    onClick={sendMessage}
                                    disabled={!text.trim()}
                                    aria-label="Send message"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={styles.emptyMain}>
                            <p style={styles.emptyMainTitle}>Your messages</p>
                            <p style={styles.emptyMainSub}>Pick a conversation from the list</p>
                        </div>
                    )}
                </main>

            </div>
        </>
    );
}

export default Chat;