import { useEffect, useRef } from "react";

function MessageBox({ messages, currentUser }) {
    const containerRef = useRef();

    useEffect(() => {
        // scroll to bottom when messages update
        const el = containerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => {
                const isOwnMessage = String(msg.senderId) === String(currentUser?._id);

                return (
                    <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs break-words ${isOwnMessage ? "bg-black text-white" : "bg-gray-300 text-black"}`}
                        >
                            {msg.message}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MessageBox;