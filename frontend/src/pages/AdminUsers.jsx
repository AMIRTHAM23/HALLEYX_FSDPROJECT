import { useEffect, useState } from "react"
import API from "../services/api"

function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const loadUsers = () => {
        setLoading(true)
        setError("")
        API.get("/users")
            .then((res) => {
                if (res.data?.success) {
                    setUsers(res.data.users || [])
                } else {
                    setUsers([])
                }
            })
            .catch(() => {
                setError("Failed to load users")
                setUsers([])
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const updateUser = (id, updates) => {
        API.put(`/users/${id}`, updates)
            .then(() => loadUsers())
            .catch(() => setError("Failed to update user"))
    }

    const deleteUser = (id) => {
        if (!window.confirm("Delete this user?")) return
        API.delete(`/users/${id}`)
            .then(() => loadUsers())
            .catch(() => setError("Failed to delete user"))
    }

    return (
        <div className="relative bg-transparent">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Admin - Users</h1>
            </div>

            {loading && (
                <div className="text-center py-20">
                    <div className="text-gray-500">Loading users...</div>
                </div>
            )}

            {error && (
                <div className="text-center py-20">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={loadUsers}
                        className="bg-[#8B5E34] text-white px-4 py-2 rounded hover:bg-[#6F4726]"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="w-full bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 text-left">Username</th>
                                    <th className="p-2 text-left">Email</th>
                                    <th className="p-2 text-left">Role</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-b">
                                        <td className="p-2 whitespace-normal break-words">{u.username}</td>
                                        <td className="p-2 whitespace-normal break-words">{u.email}</td>
                                        <td className="p-2">
                                            <select
                                                value={u.role}
                                                onChange={(e) => updateUser(u._id, { role: e.target.value })}
                                                className="border p-1 rounded"
                                            >
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => updateUser(u._id, { isActive: !u.isActive })}
                                                className={`px-2 py-1 rounded text-white text-sm ${u.isActive ? "bg-green-600" : "bg-gray-500"}`}
                                            >
                                                {u.isActive ? "Active" : "Disabled"}
                                            </button>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!users.length && (
                                    <tr>
                                        <td colSpan={5} className="p-3 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers
