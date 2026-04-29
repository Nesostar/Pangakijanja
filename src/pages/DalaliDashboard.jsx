import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const PACKAGE_LIMITS = {
  Primary: { listings: 5, analytics: false, featured: false },
  Secondary: { listings: 10, analytics: true, featured: false },
  Premium: { listings: Infinity, analytics: true, featured: true },
}

export default function DalaliDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [roomCount, setRoomCount] = useState(0)
  const [notifications, setNotifications] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchData()

    // 🔥 REALTIME BOOKINGS
    const channel = supabase
      .channel("dalali-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `owner_id=eq.${user.id}`,
        },
        () => setNotifications((prev) => prev + 1)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  const fetchData = async () => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    setProfile(profileData)

    const { count } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", user.id)

    setRoomCount(count || 0)

    const { data: bookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("owner_id", user.id)
      .eq("status", "pending")

    setNotifications(bookings?.length || 0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  if (!profile) {
    return <div className="p-6 text-center">Loading...</div>
  }

  const currentPackage = profile.package || "Primary"
  const limits = PACKAGE_LIMITS[currentPackage]
  const canAddRoom = roomCount < limits.listings

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a]">

      {/* 🔥 NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 
        bg-white/70 backdrop-blur-md shadow-sm rounded-none md:rounded-full 
        mx-0 md:mx-10 mt-0 md:mt-6">

        {/* LOGO */}
        <div className="text-lg md:text-xl font-bold text-blue-900">
          DalaliPro ({currentPackage})
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <button onClick={() => navigate("/listings")}>Listings</button>

          <button
            onClick={() => canAddRoom && navigate("/add-room")}
            className={!canAddRoom ? "text-gray-400 cursor-not-allowed" : ""}
          >
            Add Room
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="relative"
          >
            Bookings
            {notifications > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {notifications}
              </span>
            )}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* DESKTOP LOGOUT */}
          <button
            onClick={handleLogout}
            className="hidden md:block px-4 py-2 border border-blue-900 rounded-full text-blue-900"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden mx-4 mt-2 bg-white rounded-xl shadow p-4 space-y-3 z-50 relative">

          <button
            onClick={() => {
              navigate("/listings")
              setMenuOpen(false)
            }}
            className="block w-full text-left py-2"
          >
            Listings
          </button>

          <button
            onClick={() => {
              navigate("/add-room")
              setMenuOpen(false)
            }}
            className="block w-full text-left py-2"
          >
            Add Room
          </button>

          <button
            onClick={() => {
              navigate("/analytics")
              setMenuOpen(false)
            }}
            className="block w-full text-left py-2"
          >
            Analytics
          </button>

          <button
            onClick={() => {
              navigate("/analytics")
              setMenuOpen(false)
            }}
            className="block w-full text-left py-2"
          >
            Bookings ({notifications})
          </button>

          <button
            onClick={() => {
              handleLogout()
              setMenuOpen(false)
            }}
            className="block w-full text-left py-2 text-red-500"
          >
            Logout
          </button>
        </div>
      )}

      {/* 🔥 HERO */}
      <div className="flex flex-col items-center text-center mt-12 md:mt-24 px-4">

        <h1 className="text-3xl md:text-6xl font-bold text-blue-900">
          Smart Property Management
        </h1>

        <p className="mt-4 md:mt-6 text-sm md:text-lg text-gray-700 max-w-xl">
          Welcome {profile.first_name}. You are on{" "}
          <span className="font-bold">{currentPackage}</span> plan.
        </p>

        {/* 📊 USAGE */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow w-full max-w-sm">
          Listings Used: {roomCount} /{" "}
          {limits.listings === Infinity ? "∞" : limits.listings}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 w-full max-w-md">

          <button
            onClick={() => navigate("/listings")}
            className="w-full px-6 py-3 rounded-full bg-blue-900 text-white"
          >
            View Listings
          </button>

          <button
            onClick={() => canAddRoom && navigate("/add-room")}
            disabled={!canAddRoom}
            className={`w-full px-6 py-3 rounded-full border ${
              canAddRoom
                ? "border-blue-900 text-blue-900"
                : "border-gray-300 text-gray-400"
            }`}
          >
            {canAddRoom ? "Add Room" : "Upgrade Plan"}
          </button>
        </div>

        {/* UPGRADE NOTICE */}
        {!canAddRoom && (
          <div className="mt-4 text-red-600 text-sm">
            Limit reached.{" "}
            <button
              onClick={() => navigate("/pricing")}
              className="underline"
            >
              Upgrade now
            </button>
          </div>
        )}

        {/* PREMIUM FEATURE */}
        {limits.featured && (
          <div className="mt-6 text-green-600 font-semibold">
            🌟 You can feature your properties!
          </div>
        )}
      </div>
    </div>
  )
}