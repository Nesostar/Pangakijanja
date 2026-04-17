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

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      // Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profileData)

      // Count rooms
      const { count } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id)

      setRoomCount(count || 0)
    }

    fetchData()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  if (!profile) {
  return (
    <div className="p-10 text-center">
      Loading dashboard...
    </div>
  )
}

  const currentPackage = profile.package || "Primary"
  const limits = PACKAGE_LIMITS[currentPackage]

  const canAddRoom = roomCount < limits.listings

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/70 backdrop-blur-md shadow-sm rounded-full mx-10 mt-6">
        <div className="text-xl font-bold text-blue-900">
          DalaliPro ({currentPackage})
        </div>

        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <button onClick={() => navigate("/listings")}>Listings</button>

          {/* 🔥 Disable if limit reached */}
          <button
            onClick={() => canAddRoom && navigate("/add-room")}
            className={!canAddRoom ? "text-gray-400 cursor-not-allowed" : ""}
          >
            Add Room
          </button>

          {/* 🔥 Analytics only for higher packages */}
          {limits.analytics && (
            <button onClick={() => navigate("/analytics")}>
              Analytics
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full border border-blue-900 text-blue-900"
          >
            Sign Out
          </button>

          <button
            onClick={() => canAddRoom && navigate("/add-room")}
            disabled={!canAddRoom}
            className={`px-6 py-2 rounded-full ${
              canAddRoom
                ? "bg-blue-900 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {canAddRoom ? "Start Now" : "Limit Reached"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900">
          Smart Property Management
        </h1>

        <p className="mt-6 text-lg text-gray-700 max-w-2xl">
          Welcome {profile.first_name}. You are on{" "}
          <span className="font-bold">{currentPackage}</span> plan.
        </p>

        {/* 📊 USAGE */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <p>
            Listings Used: {roomCount} /{" "}
            {limits.listings === Infinity ? "∞" : limits.listings}
          </p>
        </div>

        <div className="flex gap-6 mt-10">
          <button
            onClick={() => navigate("/listings")}
            className="px-8 py-4 rounded-full bg-blue-900 text-white"
          >
            View Listings
          </button>

          <button
            onClick={() => canAddRoom && navigate("/add-room")}
            disabled={!canAddRoom}
            className={`px-8 py-4 rounded-full border ${
              canAddRoom
                ? "border-blue-900 text-blue-900"
                : "border-gray-300 text-gray-400"
            }`}
          >
            {canAddRoom ? "Add New Room" : "Upgrade Plan"}
          </button>
        </div>

        {/* 🔥 UPGRADE PROMPT */}
        {!canAddRoom && (
          <div className="mt-6 text-red-600">
            You have reached your limit.{" "}
            <button
              onClick={() => navigate("/upgrade")}
              className="underline"
            >
              Upgrade now
            </button>
          </div>
        )}

        {/* 🔥 PREMIUM FEATURE */}
        {limits.featured && (
          <div className="mt-10 text-green-600 font-semibold">
            🌟 You can feature your properties!
          </div>
        )}
      </div>
    </div>
  )
}