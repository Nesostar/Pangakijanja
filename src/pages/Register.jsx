import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError("")

    try {
      // ✅ 1. Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const user = data.user

      if (!user) {
        throw new Error("User not created")
      }

      // ✅ 2. Insert profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          role: "customer",
        })

      if (profileError) {
        console.error("PROFILE ERROR:", profileError)
        throw new Error("Failed to create profile: " + profileError.message)
      }

      alert("Registration successful!")
      navigate("/")

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 border p-3 rounded-lg"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 border p-3 rounded-lg"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}