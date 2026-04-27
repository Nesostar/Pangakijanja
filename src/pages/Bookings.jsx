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
        rooms (title, location, images)
      `)
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })

    if (!error) setBookings(data || [])
    else console.error(error)

    setLoading(false)
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a] px-4 md:px-10 py-6">

      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
        My Bookings
      </h1>

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
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* IMAGE */}
                <img
                  src={image}
                  className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded-lg"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-blue-900">
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

                  {b.status === "approved" && b.contact_phone && (
                    <p className="mt-2 text-green-700 font-semibold">
                      📞 {b.contact_phone}
                    </p>
                  )}

                  {b.status === "pending" && (
                    <p className="text-sm text-gray-500 mt-1">
                      Waiting for response...
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