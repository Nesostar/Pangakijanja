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

  // 📥 FETCH ROOM
  const fetchRoom = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) {
      setRoom(data)
    }

    setLoading(false)
  }

  // 👁️ TRACK VIEWS
  const incrementViews = async () => {
    await supabase.rpc("increment_room_views", {
      room_id: id,
    })
  }

  // 🏠 BOOK ROOM
  const handleBooking = async () => {
    if (!user) {
      alert("Please login first")
      return
    }

    setBookingLoading(true)

    try {
      // 🔍 CHECK DUPLICATE BOOKING
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

      // ✅ INSERT BOOKING
      const { error } = await supabase.from("bookings").insert([
        {
          room_id: id,
          customer_id: user.id,
          owner_id: room.owner_id,
          status: "pending",
        },
      ])

      if (error) {
        console.error(error)
        alert(error.message)
      } else {
        alert("Booking request sent ✅")
      }

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }

    setBookingLoading(false)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!room) return <div className="p-6">Room not found</div>

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">{room.title}</h1>

      {/* 🔥 IMAGE GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {room.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="room"
            className="w-full h-48 object-cover rounded-lg hover:scale-105 transition"
          />
        ))}
      </div>

      {/* DETAILS */}
      <div className="space-y-2">
        <p className="text-gray-600 text-lg">📍 {room.location}</p>

        <p className="text-2xl font-semibold text-green-700">
          Tsh {room.price}
        </p>

        <p className="text-blue-600 font-medium">
          Type: {room.room_type}
        </p>

        {/* 👁️ VIEWS */}
        <p className="text-sm text-gray-500">
          👁️ {room.views || 0} views
        </p>
      </div>

      {/* 🔥 BOOK BUTTON */}
      <button
        onClick={handleBooking}
        disabled={bookingLoading}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        {bookingLoading ? "Booking..." : "Book Now"}
      </button>

    </div>
  )
}