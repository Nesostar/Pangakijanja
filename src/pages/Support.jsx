import React, { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Support() {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const sendTicket = async () => {
    if (!message) {
      alert("Enter message")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("support_tickets")
      .insert([
        {
          user_id: user.id,
          message,
        },
      ])

    if (error) {
      alert("Failed to send")
    } else {
      alert("Message sent ✅")
      setMessage("")
    }

    setLoading(false)
  }

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-xl font-bold mb-4">Support</h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-3 rounded mb-4"
        rows={5}
        placeholder="Describe your issue..."
      />

      <button
        onClick={sendTicket}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </div>
  )
}