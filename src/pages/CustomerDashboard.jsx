import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      setProfile(data)
    }

    fetchProfile()
  }, [user])

  if (!profile) return <div className="p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/70 backdrop-blur-md shadow-sm rounded-full mx-10 mt-6">
        <div className="text-xl font-bold text-blue-900">
          PangaKijanja
        </div>

        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#">Platform</a>
          <a href="#">Rooms</a>
          <a href="#">Support</a>
          <a href="#">Pricing</a>
        </div>

        <div className="flex gap-4">
          {profile.role === "customer" && (
            <button
              onClick={() => navigate("/upgrade")}
              className="px-6 py-2 rounded-full border border-blue-900 text-blue-900 font-medium hover:bg-blue-50 transition"
            >
              Upgrade to Dalali
            </button>
          )}

          <button className="px-6 py-2 rounded-full bg-blue-900 text-white font-semibold hover:bg-blue-800 transition">
            Account
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 leading-tight max-w-4xl">
          Find & Book Rooms <br /> Effortlessly
        </h1>

        <p className="mt-6 text-lg text-gray-700 max-w-2xl">
          Welcome {profile.first_name}. Explore available rooms,
          manage your bookings, and stay connected — all in one place.
        </p>

        <div className="flex gap-6 mt-10">
          <button className="px-8 py-4 rounded-full bg-blue-900 text-white text-lg font-semibold hover:bg-blue-800 transition shadow-lg">
            Browse Rooms
          </button>

          <button className="px-8 py-4 rounded-full border border-blue-900 text-blue-900 text-lg font-semibold hover:bg-blue-50 transition">
            View Bookings
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="mt-24 px-10 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="font-semibold text-xl mb-3 text-blue-900">
            Available Rooms
          </h2>
          <p className="text-gray-600">
            Browse and book rooms that match your preferences.
          </p>
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="font-semibold text-xl mb-3 text-blue-900">
            Your Bookings
          </h2>
          <p className="text-gray-600">
            Manage your active and past bookings easily.
          </p>
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="font-semibold text-xl mb-3 text-blue-900">
            Notifications
          </h2>
          <p className="text-gray-600">
            Stay updated with booking alerts and messages.
          </p>
        </div>
      </div>

    </div>
  )
}
