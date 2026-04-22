import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    fetchNotifications()
    markAsRead()

    // ⚡ REAL-TIME LISTENER
    const channel = supabase
      .channel("notifications-page")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
          filter: `customer_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // 🔥 FETCH
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        status,
        contact_phone,
        is_read,
        rooms(title)
      `)
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })

    if (!error) {
      setNotifications(data || [])
    }

    setLoading(false)
  }

  // ✅ MARK ALL AS READ
  const markAsRead = async () => {
    await supabase
      .from("bookings")
      .update({ is_read: true })
      .eq("customer_id", user.id)
  }

  if (loading) {
    return <div className="p-6">Loading notifications...</div>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-white p-4 rounded shadow mb-4 ${
              !n.is_read ? "border-l-4 border-blue-500" : ""
            }`}
          >
            <p className="font-semibold">
              Room: {n.rooms?.title}
            </p>

            <p className="mt-1">
              Status:{" "}
              <span
                className={
                  n.status === "approved"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {n.status}
              </span>
            </p>

            {n.status === "approved" && n.contact_phone && (
              <p className="mt-2 text-green-700 font-bold">
                📞 Call: {n.contact_phone}
              </p>
            )}

            {n.status === "pending" && (
              <p className="text-gray-500 mt-2">
                Waiting for owner response...
              </p>
            )}

            {!n.is_read && (
              <p className="text-xs text-blue-600 mt-2">
                ● New
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}