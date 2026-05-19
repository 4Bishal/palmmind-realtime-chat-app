function UserList({ users, selectedUser, setSelectedUser }) {
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
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            ))}
        </div>
    );
}

export default UserList;