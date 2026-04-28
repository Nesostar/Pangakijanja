import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function RoomDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchRoom()
    incrementViews()
  }, [id])

  const fetchRoom = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) setRoom(data)

    setLoading(false)
  }

  const incrementViews = async () => {
    await supabase.rpc("increment_room_views", {
      room_id: id,
    })
  }

  const handleBooking = async () => {
    if (!user) {
      alert("Please login first")
      return
    }

    setBookingLoading(true)

    try {
      const { data: existing } = await supabase
        .from("bookings")
        .select("*")
        .eq("room_id", id)
        .eq("customer_id", user.id)
        .maybeSingle()

      if (existing) {
        alert("You already booked this room")
        setBookingLoading(false)
        return
      }

      const { error } = await supabase.from("bookings").insert([
        {
          room_id: id,
          customer_id: user.id,
          owner_id: room.owner_id,
          status: "pending",
        },
      ])

      if (!error) {
        alert("Booking request sent ✅")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }

    setBookingLoading(false)
  }

  if (loading)
    return <div className="p-6 text-center">Loading...</div>

  if (!room)
    return <div className="p-6 text-center">Room not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a] px-4 md:px-10 py-6">

      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-6">
          {room.title}
        </h1>

        {/* 🔥 IMAGE GALLERY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {room.images?.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl shadow-md bg-white/80 backdrop-blur-lg"
            >
              <img
                src={img}
                alt="room"
                className="w-full h-48 object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>

        {/* 🔥 DETAILS CARD */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-6">

          <p className="text-gray-700 text-lg mb-2">
            📍 {room.location}
          </p>

          <p className="text-2xl font-semibold text-green-700 mb-2">
            Tsh {room.price}
          </p>

          <p className="text-blue-700 font-medium mb-2">
            Type: {room.room_type}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            👁️ {room.views || 0} views
          </p>

          {/* 🔥 BOOK BUTTON */}
          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>

        </div>
      </div>
    </div>
  )
}