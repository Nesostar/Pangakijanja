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
    if (user) {
      fetchData()
    }
  }, [user])

  // 🔥 FETCH ALL DATA
  const fetchData = async () => {
    setLoading(true)

    try {
      // ✅ ROOMS
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("*")
        .eq("owner_id", user.id)

      if (roomsError) {
        console.error("ROOM ERROR:", roomsError)
      }

      setRooms(roomsData || [])

      // ✅ BOOKINGS (JOIN WITH ROOMS + CUSTOMER)
      const { data: bookingsData, error: bookingsError } =
        await supabase
          .from("bookings")
          .select(`
            *,
            rooms(title),
            customer:profiles!bookings_customer_id_fkey(first_name, last_name)
          `)
          .eq("owner_id", user.id)

      if (bookingsError) {
        console.error("BOOKINGS ERROR:", bookingsError)
      }

      console.log("BOOKINGS DATA:", bookingsData)

      setBookings(bookingsData || [])

    } catch (err) {
      console.error("FETCH ERROR:", err)
    }

    setLoading(false)
  }

  // 📞 RESPOND TO BOOKING
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
        is_read: false, // 🔥 THIS TRIGGERS NOTIFICATION
      })
      .eq("id", bookingId)

    if (error) {
      console.error(error)
      alert("Failed to respond")
    } else {
      alert("Customer notified ✅")
      fetchData()
    }
  }

  if (loading) return <div className="p-6">Loading analytics...</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Analytics Dashboard
      </h1>

      {/* 🏠 ROOM STATS */}
      <h2 className="text-xl font-semibold mb-4">
        Your Rooms
      </h2>

      {rooms.length === 0 ? (
        <p>No rooms yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {rooms.map((room) => {
            const roomBookings = bookings.filter(
              (b) => b.room_id === room.id
            )

            return (
              <div
                key={room.id}
                className="bg-white p-4 rounded shadow"
              >
                <h3 className="font-bold">{room.title}</h3>

                <p>👀 Views: {room.views || 0}</p>

                <p>📩 Bookings: {roomBookings.length}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* 📩 BOOKINGS */}
      <h2 className="text-xl font-semibold mb-4">
        Booking Requests
      </h2>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <p>
              <b>Room:</b> {b.rooms?.title || "N/A"}
            </p>

            <p>
              <b>Customer:</b>{" "}
              {b.customer?.first_name || "Unknown"}{" "}
              {b.customer?.last_name || ""}
            </p>

            <p>
              <b>Status:</b>{" "}
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

            {/* ✅ SHOW PHONE */}
            {b.contact_phone ? (
              <p className="text-green-600 font-bold mt-2">
                📞 {b.contact_phone}
              </p>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter phone"
                  className="border p-2 rounded w-full"
                  onChange={(e) =>
                    setPhoneInputs({
                      ...phoneInputs,
                      [b.id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => handleRespond(b.id)}
                  className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
