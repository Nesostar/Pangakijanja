import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!error) setProfile(data)
    }

    fetchProfile()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  if (!profile) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a]">

      {/* 🔥 NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 bg-white/70 backdrop-blur-md shadow-sm rounded-none md:rounded-full mx-0 md:mx-10 mt-0 md:mt-6">

        {/* Logo */}
        <div className="text-lg md:text-xl font-bold text-blue-900">
          PangaKijanja
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <button onClick={() => navigate("/dashboard")}>Platform</button>
          <button onClick={() => navigate("/rooms")}>Rooms</button>
          <button onClick={() => navigate("/support")}>Support</button>
          <button onClick={() => navigate("/notifications")}>Notifications</button>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex gap-4">
          {profile.role === "customer" && (
            <button
              onClick={() => navigate("/upgrade")}
              className="px-4 py-2 rounded-full border border-blue-900 text-blue-900 hover:bg-blue-50"
            >
              Upgrade to Dalali
            </button>
          )}

          <button
            onClick={() => navigate("/account")}
            className="px-4 py-2 rounded-full bg-blue-900 text-white"
          >
            Account
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded bg-red-500 text-white"
          >
            Logout
          </button>
        </div>

        {/* 🔥 MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* 🔥 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md p-4 space-y-3">
          <button onClick={() => navigate("/dashboard")} className="block w-full text-left">Platform</button>
          <button onClick={() => navigate("/rooms")} className="block w-full text-left">Rooms</button>
          <button onClick={() => navigate("/support")} className="block w-full text-left">Support</button>
          <button onClick={() => navigate("/notifications")} className="block w-full text-left">Notifications</button>
          <button onClick={() => navigate("/payment")} className="block w-full text-left">Upgrade to Dalali</button>
          <button onClick={() => navigate("/account")} className="block w-full text-left">Account</button>
          <button onClick={handleLogout} className="block w-full text-left text-red-500">Logout</button>
        </div>
      )}

      {/* 🔥 HERO */}
      <div className="flex flex-col items-center text-center mt-16 md:mt-24 px-4 md:px-6">
        <h1 className="text-3xl md:text-6xl font-bold text-blue-900 leading-tight">
          Find & Book Rooms <br /> Effortlessly
        </h1>

        <p className="mt-4 md:mt-6 text-sm md:text-lg text-gray-700 max-w-xl">
          Welcome {profile.first_name}. Explore available rooms, manage your bookings, and stay connected — all in one place.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/rooms")}
            className="px-6 py-3 rounded-full bg-blue-900 text-white"
          >
            Browse Rooms
          </button>

          <button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 rounded-full border border-blue-900 text-blue-900"
          >
            View Bookings
          </button>
        </div>
      </div>

      {/* 🔥 CARDS */}
      <div className="mt-16 md:mt-24 px-4 md:px-10 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          onClick={() => navigate("/rooms")}
          className="p-6 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <h2 className="font-semibold text-lg mb-2 text-blue-900">
            Available Rooms
          </h2>
          <p className="text-gray-600 text-sm">
            Browse and book rooms that match your preferences.
          </p>
        </div>

        <div
          onClick={() => navigate("/bookings")}
          className="p-6 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <h2 className="font-semibold text-lg mb-2 text-blue-900">
            Your Bookings
          </h2>
          <p className="text-gray-600 text-sm">
            Manage your active and past bookings easily.
          </p>
        </div>

        <div
          onClick={() => navigate("/pricing")}
          className="p-6 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <h2 className="font-semibold text-lg mb-2 text-blue-900">
            Pricing
          </h2>
          <p className="text-gray-600 text-sm">
            Stay updated with pricing alerts and messages.
          </p>
        </div>

      </div>
    </div>
  )
}