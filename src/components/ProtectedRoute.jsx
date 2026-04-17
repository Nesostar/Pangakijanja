import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth()

  // 🔥 Wait until auth is fully loaded
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>
  }

  // ❌ Only redirect AFTER loading is complete
  if (!user) {
    return <Navigate to="/" replace />
  }

  // If profile not ready yet, don't redirect — just wait
  if (!profile) {
    return <div className="text-center mt-10">Loading profile...</div>
  }

  if (adminOnly && profile.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}