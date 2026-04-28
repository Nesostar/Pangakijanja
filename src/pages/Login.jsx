import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Link, useNavigate } from "react-router-dom"

// 🔥 IMPORT YOUR LOGO IMAGE
import logo from "../assets/logo.png" // <-- replace with your actual logo path

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError("")

    try {
      const { data: userData, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) throw error

      const user = userData.user

      // 🔍 FETCH PROFILE
      let { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

      // 🔥 AUTO CREATE PROFILE
      if (profileError || !profile) {
        const { error: insertError } =
          await supabase.from("profiles").insert({
            id: user.id,
            role: "customer",
          })

        if (insertError) {
          throw new Error("Profile creation failed")
        }

        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        profile = newProfile
      }

      // ✅ REDIRECT
      if (profile.role === "admin") {
        navigate("/admin-dashboard")
      } else if (profile.role === "dalali") {
        navigate("/dalali-dashboard")
      } else {
        navigate("/dashboard")
      }

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

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg 
        shadow-xl rounded-2xl p-8">

        {/* 🔥 LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="PangaKijanja Logo"
            className="w-50 h-50 object-contain mb-2"
          />
          <h2 className="text-2xl font-bold text-blue-900">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600">
            Login to continue
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white p-3 rounded-lg 
              hover:bg-blue-800 transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-5 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-700 font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}