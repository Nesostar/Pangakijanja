import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { PACKAGE_LIMITS } from "../config/packages"

export default function Listings() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const userPackage = profile?.package || "Primary"
  const limit = PACKAGE_LIMITS[userPackage].listings

  useEffect(() => {
    if (!user) return
    fetchRooms()
  }, [user])

  const fetchRooms = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })

    if (!error) setRooms(data || [])
    else console.error(error)

    setLoading(false)
  }

  const handleDelete = async (e, roomId) => {
    e.stopPropagation()

    if (!window.confirm("Delete this room?")) return

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", roomId)

    if (error) {
      alert("Failed to delete ❌")
    } else {
      fetchRooms()
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a] px-4 md:px-10 py-6">

      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
        Your Listings
      </h1>

      <p className="text-gray-700 mb-6">
        Package: <b>{userPackage}</b> | {rooms.length}/
        {limit === Infinity ? "∞" : limit}
      </p>

      {rooms.length === 0 ? (
        <p className="text-gray-600">No rooms yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const image = room.images?.[0] || "https://via.placeholder.com/400"

            return (
              <div
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
              >
                {/* IMAGE */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={image}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h2 className="font-bold text-lg text-blue-900">
                    {room.title}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    📍 {room.location}
                  </p>

                  <p className="font-semibold mt-2">
                    Tsh {room.price}
                  </p>

                  <p className="text-sm text-blue-700 mt-1">
                    {room.room_type}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {room.images?.length || 0} images
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/edit-room/${room.id}`)
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, room.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}