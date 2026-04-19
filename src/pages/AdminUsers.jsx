import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*")
    setUsers(data || [])
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const approveDalali = async (id) => {
    await supabase
      .from("profiles")
      .update({ role: "dalali", dalali_request: false })
      .eq("id", id)

    fetchUsers()
  }

  const toggleDalali = async (id, status) => {
    const newStatus = status === "deactivated" ? "active" : "deactivated"

    await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", id)
      .eq("role", "dalali")

    fetchUsers()
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">

              <td className="p-3">
                {u.first_name} {u.last_name}
              </td>

              <td className="p-3">{u.role}</td>

              <td className="p-3">
                {u.role === "dalali"
                  ? u.status || "active"
                  : "active"}
              </td>

              <td className="p-3 flex gap-2">

                {u.dalali_request && (
                  <button
                    onClick={() => approveDalali(u.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                )}

                {u.role === "dalali" && (
                  <button
                    onClick={() => toggleDalali(u.id, u.status)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    {u.status === "deactivated"
                      ? "Activate"
                      : "Deactivate"}
                  </button>
                )}

              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}