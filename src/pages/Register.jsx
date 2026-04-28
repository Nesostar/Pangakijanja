import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const user = data.user

      if (!user) {
        throw new Error("User not created")
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          role: "customer",
        })

      if (profileError) {
        throw new Error(profileError.message)
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
    <div className="min-h-screen flex items-center justify-center px-4 
      bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a]">

      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-md">

        {/* 🔥 LOGO */}
        <div className="flex flex-col items-center mb-6">
  <img
    src={logo}   // 🔥 your logo file
    alt="PangaKijanja Logo"
    className="w-50 h-50 object-contain"
  />
  <p className="text-sm text-gray-500">
    Create your account
  </p>
</div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-4">

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="First Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* LINK */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-900 font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}