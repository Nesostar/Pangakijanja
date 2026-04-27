import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Analytics() {
  const { user } = useAuth()

  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [phoneInputs, setPhoneInputs] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  // 🔥 FETCH DATA
  const fetchData = async () => {
    setLoading(true)

    try {
      const { data: roomsData } = await supabase
        .from("rooms")
        .select("*")
        .eq("owner_id", user.id)

      setRooms(roomsData || [])

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          *,
          rooms(title),
          customer:profiles!bookings_customer_id_fkey(first_name, last_name)
        `)
        .eq("owner_id", user.id)

      setBookings(bookingsData || [])
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  // 📞 RESPOND
  const handleRespond = async (bookingId) => {
    const phone = phoneInputs[bookingId]

    if (!phone) {
      alert("Enter phone number")
      return
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        contact_phone: phone,
        status: "approved",
        is_read: false,
      })
      .eq("id", bookingId)

    if (!error) {
      fetchData()
    }
  }

  if (loading)
    return <div className="p-6 text-center">Loading analytics...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a] px-4 md:px-10 py-6">

      {/* TITLE */}
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
        Analytics Dashboard
      </h1>

      {/* 🏠 ROOM STATS */}
      <h2 className="text-lg md:text-xl font-semibold text-blue-900 mb-4">
        Your Rooms Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {rooms.map((room) => {
          const roomBookings = bookings.filter(
            (b) => b.room_id === room.id
          )

          return (
            <div
              key={room.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-5 hover:shadow-xl transition"
            >
              <h3 className="font-bold text-blue-900 text-lg">
                {room.title}
              </h3>

              <p className="text-gray-600 mt-2">
                👀 Views: {room.views || 0}
              </p>

              <p className="text-gray-600">
                📩 Bookings: {roomBookings.length}
              </p>
            </div>
          )
        })}

      </div>

      {/* 📩 BOOKINGS */}
      <h2 className="text-lg md:text-xl font-semibold text-blue-900 mb-4">
        Booking Requests
      </h2>

      <div className="space-y-5">

        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings yet</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-5"
            >

              <p className="font-semibold text-blue-900">
                Room: {b.rooms?.title || "N/A"}
              </p>

              <p className="text-gray-700 mt-1">
                Customer:{" "}
                {b.customer?.first_name || "Unknown"}{" "}
                {b.customer?.last_name || ""}
              </p>

              <p className="mt-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    b.status === "approved"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {b.status}
                </span>
              </p>

              {/* 📞 PHONE */}
              {b.contact_phone ? (
                <p className="text-green-600 font-bold mt-3">
                  📞 {b.contact_phone}
                </p>
              ) : (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onChange={(e) =>
                      setPhoneInputs({
                        ...phoneInputs,
                        [b.id]: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() => handleRespond(b.id)}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Send
                  </button>
                </div>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  )
}