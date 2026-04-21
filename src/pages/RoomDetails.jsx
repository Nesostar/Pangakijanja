import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function RoomDetails() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single()

      if (!error) setRoom(data)
    }

    fetchRoom()
  }, [id])

  if (!room) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{room.title}</h1>

      {/* 🔥 IMAGE GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {room.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="room"
            className="w-full h-48 object-cover rounded"
          />
        ))}
      </div>

      <p className="text-gray-600">📍 {room.location}</p>
      <p className="text-xl font-semibold mt-2">Tsh {room.price}</p>
      <p className="mt-2 text-blue-600">Type: {room.room_type}</p>
    </div>
  )
}