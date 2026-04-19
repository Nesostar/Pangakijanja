import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from("profiles").select("*")
    setUsers(data || [])
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  // 📊 Analytics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status !== "deactivated").length
  const dalali = users.filter(u => u.role === "dalali").length
  const deactivatedDalali = users.filter(
    u => u.role === "dalali" && u.status === "deactivated"
  ).length

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin-users")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Manage Users
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

        <div className="bg-white p-5 rounded shadow">
          <p>Total Users</p>
          <h2 className="text-2xl font-bold">{totalUsers}</h2>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p>Active Users</p>
          <h2 className="text-2xl font-bold">{activeUsers}</h2>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p>Dalali</p>
          <h2 className="text-2xl font-bold">{dalali}</h2>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p>Deactivated Dalali</p>
          <h2 className="text-2xl font-bold">{deactivatedDalali}</h2>
        </div>

      </div>

      {/* SIMPLE GRAPH (bar style) */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">User Distribution</h2>

        <div className="space-y-3">

          <div>
            <p>Customers</p>
            <div className="bg-gray-200 h-4 rounded">
              <div
                className="bg-green-500 h-4 rounded"
                style={{
                  width: `${(users.filter(u => u.role === "customer").length / totalUsers) * 100 || 0}%`
                }}
              />
            </div>
          </div>

          <div>
            <p>Dalali</p>
            <div className="bg-gray-200 h-4 rounded">
              <div
                className="bg-blue-500 h-4 rounded"
                style={{
                  width: `${(dalali / totalUsers) * 100 || 0}%`
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}