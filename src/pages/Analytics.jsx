import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Analytics() {
  const { user } = useAuth()

  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [phoneInputs, setPhoneInputs] = useState({})

  useEffect(() => {
    if (!user) return

    fetchData()
  }, [user])

  const fetchData = async () => {
    // 🔥 Get rooms
    const { data: roomsData } = await supabase
      .from("rooms")
      .select("*")
      .eq("owner_id", user.id)

    setRooms(roomsData || [])

    // 🔥 Get bookings with customer info
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select(`
        *,
        rooms(title),
        profiles(first_name, last_name)
      `)
      .eq("owner_id", user.id)

    setBookings(bookingsData || [])
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
      })
      .eq("id", bookingId)

    if (error) {
      console.error(error)
      alert("Failed to respond")
    } else {
      alert("Customer can now contact you ✅")
      fetchData()
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* 🏠 ROOM STATS */}
      <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{room.title}</h3>
            <p>👀 Views: {room.views || 0}</p>
            <p>
              📩 Bookings:{" "}
              {
                bookings.filter((b) => b.room_id === room.id)
                  .length
              }
            </p>
          </div>
        ))}
      </div>

      {/* 📩 BOOKINGS SECTION */}
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
              <b>Room:</b> {b.rooms?.title}
            </p>

            <p>
              <b>Customer:</b>{" "}
              {b.profiles?.first_name}{" "}
              {b.profiles?.last_name}
            </p>

            <p>
              <b>Status:</b> {b.status}
            </p>

            {/* ✅ SHOW PHONE IF ALREADY SENT */}
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
                  className="bg-green-600 text-white px-4 rounded"
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