export const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'DM Sans', sans-serif; background: #f5f3ef; }

.msg-bubble {
    min-width: 48px;
    width: fit-content;
    padding: 0.55rem 0.9rem;
    border-radius: 14px;
    font-size: 0.875rem;
    line-height: 1.5;
    word-break: break-word;
    white-space: pre-wrap;
}
    .msg-bubble.mine {
        background: #1a1916;
        color: #f5f3ef;
        border-bottom-right-radius: 4px;
    }
    .msg-bubble.theirs {
        background: #fff;
        color: #1a1916;
        border: 1px solid #e8e4dc;
        border-bottom-left-radius: 4px;
    }

    .user-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.65rem 1rem;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.12s;
    }
    .user-row:hover { background: #f0ede6; }
    .user-row.active { background: #ece8e0; }

    .chat-input {
        flex: 1;
        border: 1px solid #e0dbd2;
        border-radius: 10px;
        padding: 0.65rem 1rem;
        font-size: 0.875rem;
        font-family: 'DM Sans', sans-serif;
        color: #1a1916;
        background: #faf9f7;
        outline: none;
        resize: none;
        transition: border-color 0.15s;
    }
    .chat-input:focus { border-color: #b5a98a; background: #fff; }
    .chat-input::placeholder { color: #c4bfb5; }

    .send-btn {
        padding: 0.65rem 1.25rem;
        background: linear-gradient(90deg,#1f1e1b,#2b2a27);
        color: #f5f3ef;
        border: none;
        border-radius: 10px;
        font-size: 0.875rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s;
        white-space: nowrap;
        box-shadow: 0 6px 18px rgba(26,25,22,0.09);
    }
    .send-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(26,25,22,0.12); opacity: 0.95; }
    .send-btn:active { transform: translateY(0); }

    .logout-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: 1px solid #e8e4dc;
        border-radius: 7px;
        background: transparent;
        cursor: pointer;
        color: #9a9589;
        font-size: 0.8rem;
        margin-left: auto;
        transition: background 0.12s, color 0.12s, border-color 0.12s;
        flex-shrink: 0;
    }
    .logout-btn:hover {
        background: #fef2f2;
        color: #dc2626;
        border-color: #fecaca;
    }

    /* subtle input focus shadow for better depth */
    .chat-input:focus {
        box-shadow: 0 6px 18px rgba(165,150,120,0.08) inset;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #ddd9d0; border-radius: 4px; }

    @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
`;

export const styles = {
    root: {
        display: "flex",
        height: "100vh",
        background: "#f5f3ef",
        overflow: "hidden",
    },
    sidebar: {
        width: 280,
        minWidth: 280,
        background: "#fff",
        borderRight: "1px solid #e8e4dc",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease",
    },
    sidebarHidden: {},
    brand: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.25rem 1.25rem 0.5rem",
    },
    brandName: {
        fontFamily: "'Instrument Serif', serif",
        fontSize: "1.4rem",
        color: "#1a1916",
        letterSpacing: "-0.02em",
    },
    brandOnline: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: "0.75rem",
        color: "#9a9589",
    },
    onlineDot: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "#4ade80",
        display: "inline-block",
    },
    sectionLabel: {
        fontSize: "0.7rem",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#b5b0a6",
        padding: "0.75rem 1.25rem 0.4rem",
    },
    userScroll: {
        flex: 1,
        overflowY: "auto",
        padding: "0 0.5rem",
    },
    emptyNote: {
        fontSize: "0.8125rem",
        color: "#b5b0a6",
        textAlign: "center",
        padding: "1.5rem 1rem",
    },
    userName: {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#1a1916",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    userStatus: {
        fontSize: "0.75rem",
        color: "#9a9589",
        fontWeight: 300,
    },
    sidebarFooter: {
        borderTop: "1px solid #eeebe4",
        padding: "0.875rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
    },
    footerName: {
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: "#6b6760",
    },
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#f5f3ef",
    },
    chatHeader: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.25rem",
        background: "#fff",
        borderBottom: "1px solid #e8e4dc",
    },
    backBtn: {
        background: "none",
        border: "none",
        fontSize: "1.1rem",
        cursor: "pointer",
        color: "#6b6760",
        padding: "0 0.25rem",
        lineHeight: 1,
    },
    chatHeaderName: {
        fontSize: "0.9375rem",
        fontWeight: 500,
        color: "#1a1916",
    },
    chatHeaderStatus: {
        fontSize: "0.75rem",
        color: "#9a9589",
        fontWeight: 300,
    },
    messagesArea: {
        flex: 1,
        overflowY: "auto",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
    },
    emptyChat: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        paddingTop: "4rem",
    },
    emptyChatTitle: {
        fontFamily: "'Instrument Serif', serif",
        fontSize: "1.25rem",
        color: "#1a1916",
    },
    emptyChatSub: {
        fontSize: "0.8125rem",
        color: "#9a9589",
    },
    inputArea: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.25rem",
        background: "#fff",
        borderTop: "1px solid #e8e4dc",
    },
    emptyMain: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
    },
    emptyMainTitle: {
        fontFamily: "'Instrument Serif', serif",
        fontSize: "1.5rem",
        color: "#1a1916",
    },
    emptyMainSub: {
        fontSize: "0.8125rem",
        color: "#9a9589",
    },
    loadingWrap: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f3ef",
    },
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "#1a1916",
        animation: "pulse 1.2s ease-in-out infinite",
    },
};