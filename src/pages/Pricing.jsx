import React from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Pricing() {
  const { user } = useAuth()

  const upgrade = async (packageName) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        role: "dalali",
        package: packageName,
      })
      .eq("id", user.id)

    if (error) {
      alert("Upgrade failed")
    } else {
      alert(`Upgraded to ${packageName} 🎉`)
      window.location.reload()
    }
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Choose Your Package
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* BASIC */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">Primary</h2>
          <p className="mt-2 text-gray-600">Free Plan</p>
          <p className="mt-4">✔ 2 Listings</p>

          <button
            onClick={() => upgrade("Primary")}
            className="mt-6 w-full bg-gray-600 text-white p-2 rounded"
          >
            Select
          </button>
        </div>

        {/* STANDARD */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">Standard</h2>
          <p className="mt-2 text-gray-600">Tsh 10,000</p>
          <p className="mt-4">✔ 10 Listings</p>

          <button
            onClick={() => upgrade("Standard")}
            className="mt-6 w-full bg-blue-600 text-white p-2 rounded"
          >
            Upgrade
          </button>
        </div>

        {/* PREMIUM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">Premium</h2>
          <p className="mt-2 text-gray-600">Tsh 25,000</p>
          <p className="mt-4">✔ Unlimited Listings</p>

          <button
            onClick={() => upgrade("Premium")}
            className="mt-6 w-full bg-green-600 text-white p-2 rounded"
          >
            Upgrade
          </button>
        </div>

      </div>
    </div>
  )
}