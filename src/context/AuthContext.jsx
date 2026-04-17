import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProfile = async (userId) => {
    try {
      console.log("🔍 Fetching profile for:", userId)

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("❌ Profile error:", error.message)
        setProfile(null)
        return null
      }

      console.log("✅ Profile loaded:", data)
      setProfile(data)
      return data

    } catch (err) {
      console.error("🔥 Unexpected profile error:", err)
      setProfile(null)
      return null
    }
  }

  const redirectUser = (profile) => {
    if (!profile) return

    console.log("🚀 Redirecting role:", profile.role)

    if (profile.role === "admin") {
      navigate("/admin-dashboard", { replace: true })
    } else if (profile.role === "dalali") {
      navigate("/dalali-dashboard", { replace: true })
    } else {
      navigate("/dashboard", { replace: true })
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      console.log("🚀 Initializing auth...")

      const { data: { session } } = await supabase.auth.getSession()

      if (!mounted) return

      if (session?.user) {
        console.log("✅ Session found:", session.user.id)
        setUser(session.user)

        const profileData = await fetchProfile(session.user.id)

        if (mounted) {
          redirectUser(profileData)
        }
      }

      if (mounted) {
        setLoading(false)
        console.log("✅ Auth ready")
      }
    }

    init()

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("🔄 Auth event:", event)

        if (!mounted) return

        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)

          // 🔥 IMPORTANT: DO NOT BLOCK UI
          fetchProfile(session.user.id)
            .then((profileData) => {
              redirectUser(profileData)
            })
            .catch((err) => {
              console.error("Profile fetch failed:", err)
            })
            .finally(() => {
              setLoading(false)
            })
        }

        if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
          setLoading(false)
          navigate("/", { replace: true })
        }
      })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)