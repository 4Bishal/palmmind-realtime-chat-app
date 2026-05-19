function UserList({ users, selectedUser, setSelectedUser, onlineUsers = [] }) {
    return (
        <div className="w-1/4 border-r bg-white overflow-y-auto">
            <h2 className="text-xl font-bold p-4 border-b">Users</h2>

            {users.map((user) => (
                <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition ${selectedUser?._id === user._id
                        ? "bg-gray-200"
                        : ""
                        }`}
                >
                    <div className="flex justify-between items-center">
                        <p className="font-medium">
                            {user.username}
                            <span
                                className={`inline-block ml-2 align-middle w-2 h-2 rounded-full ${onlineUsers.includes(user._id)
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                    }`}
                                aria-hidden="true"
                            />
                        </p>
                    </div>

                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            ))}
        </div>
    );
}

export default UserList;