import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        rooms (
          title,
          location,
          images
        )
      `)
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("FETCH BOOKINGS ERROR:", error)
    } else {
      setBookings(data || [])
    }

    setLoading(false)
  }

  if (loading) {
    return <div className="p-6">Loading bookings...</div>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const image =
              b.rooms?.images?.[0] ||
              "https://via.placeholder.com/400"

            return (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow p-4 flex gap-4"
              >
                {/* IMAGE */}
                <img
                  src={image}
                  alt="room"
                  className="w-32 h-24 object-cover rounded"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-bold text-lg">
                    {b.rooms?.title}
                  </h2>

                  <p className="text-gray-600">
                    📍 {b.rooms?.location}
                  </p>

                  <p className="mt-2">
                    <b>Status:</b>{" "}
                    <span
                      className={
                        b.status === "approved"
                          ? "text-green-600"
                          : b.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {b.status}
                    </span>
                  </p>

                  {/* 📞 SHOW PHONE WHEN APPROVED */}
                  {b.status === "approved" && b.contact_phone && (
                    <p className="mt-2 text-green-700 font-semibold">
                      📞 Contact: {b.contact_phone}
                    </p>
                  )}

                  {b.status === "pending" && (
                    <p className="text-sm text-gray-500 mt-1">
                      Waiting for dalali response...
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}