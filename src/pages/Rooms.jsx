import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false }) // newest first

      if (error) {
        console.error("FETCH ERROR:", error)
      } else {
        setRooms(data || [])
      }

      setLoading(false)
    }

    fetchRooms()
  }, [])

  if (loading) {
    return <div className="p-6">Loading rooms...</div>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Available Rooms</h1>

      {rooms.length === 0 ? (
        <p className="text-gray-600">No rooms available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const firstImage =
              room.images?.length > 0
                ? room.images[0]
                : "https://via.placeholder.com/400"

            return (
              <div
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)} // 🔥 VIEW DETAILS
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
              >
                {/* IMAGE */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={firstImage}
                    alt="room"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h2 className="font-bold text-lg">{room.title}</h2>

                  <p className="text-gray-600 mt-1">
                    📍 {room.location}
                  </p>

                  <p className="text-gray-800 mt-2 font-semibold">
                    Tsh {room.price}
                  </p>

                  <p className="text-sm mt-2 text-blue-700 font-medium">
                    Type: {room.room_type || "N/A"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {room.images?.length || 0} images
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}