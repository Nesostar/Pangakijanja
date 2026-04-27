import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [type, setType] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*")

    if (!error) {
      setRooms(data)
      setFilteredRooms(data)
    }

    setLoading(false)
  }

  // 🔥 FILTER LOGIC
  useEffect(() => {
    let filtered = rooms

    if (search) {
      filtered = filtered.filter((r) =>
        r.location.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (minPrice) {
      filtered = filtered.filter((r) => r.price >= Number(minPrice))
    }

    if (maxPrice) {
      filtered = filtered.filter((r) => r.price <= Number(maxPrice))
    }

    if (type) {
      filtered = filtered.filter((r) => r.room_type === type)
    }

    setFilteredRooms(filtered)
  }, [search, minPrice, maxPrice, type, rooms])

  if (loading) return <div className="p-6 text-center">Loading rooms...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a] px-4 md:px-10 py-6">

      {/* TITLE */}
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
        Browse Rooms
      </h1>

      {/* 🔍 SEARCH BAR */}
      <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-md mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="📍 Search location..."
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Price"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Single">Single</option>
          <option value="Master">Master</option>
          <option value="Self-contained">Self-contained</option>
          <option value="Apartment">Apartment</option>
        </select>

      </div>

      {/* 🏠 ROOMS GRID */}
      {filteredRooms.length === 0 ? (
        <p className="text-center text-gray-600">No rooms found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigate(`/room/${room.id}`)}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-48 overflow-hidden">
                <img
                  src={room.images?.[0] || "https://via.placeholder.com/400"}
                  alt="room"
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

                <p className="font-semibold text-gray-800 mt-2">
                  Tsh {room.price}
                </p>

                <p className="text-sm text-blue-700 mt-1">
                  {room.room_type}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}