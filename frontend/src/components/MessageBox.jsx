function MessageBox({ messages, currentUser }) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => {
                const isOwnMessage = msg.senderId === currentUser._id;

                return (
                    <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs ${isOwnMessage
                                ? "bg-black text-white"
                                : "bg-gray-300 text-black"
                                }`}
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