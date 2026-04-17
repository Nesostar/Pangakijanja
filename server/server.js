import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// 🔐 Supabase Admin (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)


// ===============================
// 💰 MOBILE MONEY PAYMENT (SIMULATED)
// ===============================
app.post("/api/pay", async (req, res) => {
  const { phone, method, amount, package: pkg, userId } = req.body

  console.log("📩 Incoming payment request:", req.body)

  // ✅ VALIDATION
  if (!phone || !method || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Missing payment details",
    })
  }

  try {
    // 🕒 SIMULATE REAL PAYMENT DELAY (like M-Pesa prompt)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("⏳ Simulating payment success...")

    // 🔥 UPDATE USER ROLE → DALALI
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        role: "dalali",
        dalali_request: false,
        package: pkg,
      })
      .eq("id", userId)
      .select()

    console.log("📊 Update result:", data)
    console.log("❌ Update error:", error)

    // ❌ HANDLE FAILURE
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Database error while updating user",
      })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or not updated",
      })
    }

    // ✅ SUCCESS RESPONSE
    return res.json({
      success: true,
      message: `✅ Payment successful via ${method}. You are now a Dalali`,
      user: data[0], // optional (for debugging)
    })

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error)

    return res.status(500).json({
      success: false,
      message: "Payment failed due to server error",
    })
  }
})


// ===============================
// 👨‍💼 ADMIN ROUTES
// ===============================
app.get("/api/admin/users", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return res.status(500).json(error)
  }

  res.json(data)
})

app.put("/api/admin/approve/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      role: "dalali",
      dalali_request: false,
    })
    .eq("id", id)

  if (error) {
    console.error(error)
    return res.status(500).json(error)
  }

  res.json({ message: "Dalali approved successfully" })
})


// ===============================
// 🚀 SERVER START
// ===============================
const PORT = 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})