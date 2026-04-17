// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/api/admin/users")
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users")
      }

      setUsers(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const approveDalali = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/approve/${id}`,
        { method: "PUT" }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Approval failed")
      }

      fetchUsers()
    } catch (err) {
      alert("Error approving Dalali")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {users.length === 0 ? (
        <div>No users found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="px-4 py-2">
                    {u.first_name} {u.last_name}
                  </td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2">
                    {u.dalali_request
                      ? "Pending Dalali Approval"
                      : u.role === "dalali"
                      ? "Approved Dalali"
                      : u.role === "admin"
                      ? "Administrator"
                      : "Customer"}
                  </td>
                  <td className="px-4 py-2">
                    {u.dalali_request && (
                      <button
                        onClick={() => approveDalali(u.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
