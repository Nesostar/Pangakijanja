import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Account() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .eq("id", user.id)

    if (error) {
      alert("Update failed")
    } else {
      alert("Profile updated ✅")
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-xl font-bold mb-4">Account Settings</h1>

      <input
        value={profile.first_name}
        onChange={(e) =>
          setProfile({ ...profile, first_name: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded"
        placeholder="First Name"
      />

      <input
        value={profile.last_name}
        onChange={(e) =>
          setProfile({ ...profile, last_name: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded"
        placeholder="Last Name"
      />

      <input
        value={profile.email}
        disabled
        className="w-full border p-2 mb-3 rounded bg-gray-100"
      />

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-600 text-white p-3 rounded"
      >
        Save Changes
      </button>
    </div>
  )
}