import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { PACKAGE_LIMITS } from "../config/packages"

export default function Listings() {
  const { user, profile } = useAuth()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const userPackage = profile?.package || "Primary"
  const limit = PACKAGE_LIMITS[userPackage].listings

  useEffect(() => {
    if (!user) return

    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("owner_id", user.id) // ✅ FIXED

      if (error) {
        console.error(error)
      } else {
        setRooms(data || [])
      }

      setLoading(false)
    }

    fetchRooms()
  }, [user])

  if (loading) return <div className="p-6">Loading listings...</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Your Listings</h1>

      {/* 🔥 PACKAGE INFO */}
      <p className="text-gray-600 mb-4">
        Package: <b>{userPackage}</b> | {rooms.length}/{limit} listings used
      </p>

      {rooms.length === 0 ? (
        <p className="text-gray-600">No rooms yet</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={
                    room.images?.length > 0
                      ? room.images[0]
                      : "https://via.placeholder.com/400"
                  }
                  alt="room"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="font-bold text-lg">{room.title}</h2>
                <p className="text-gray-600 mt-1">📍 {room.location}</p>
                <p className="text-gray-800 mt-2 font-semibold">
                  ${room.price}
                </p>

                <p className="text-sm mt-2 text-blue-700 font-medium">
                  Type: {room.room_type || "N/A"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {room.images?.length || 0} images
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}