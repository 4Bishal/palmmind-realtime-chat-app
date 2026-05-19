import { useEffect, useRef } from "react";

function MessageBox({ messages, currentUser }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => {
                const isOwnMessage = String(msg.senderId) === String(currentUser?._id);

                return (
                    <div
                        key={msg._id || msg.clientId}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs break-words ${isOwnMessage ? "bg-black text-white" : "bg-gray-300 text-black"
                                }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                );
            })}

            <div ref={bottomRef} />
        </div>
    );
}

export default MessageBox;