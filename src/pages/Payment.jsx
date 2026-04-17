// src/pages/Payment.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const { name, price } = location.state || {};

  const [method, setMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // ❗ Protect against direct access
  if (!name || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold">No package selected</h2>
      </div>
    );
  }

  // 🇹🇿 VALIDATE TANZANIA PHONE
  const validateTanzaniaPhone = (phone) => {
    const localRegex = /^(06|07)[0-9]{8}$/;       // 07XXXXXXXX
    const intlRegex = /^255(6|7)[0-9]{8}$/;       // 2557XXXXXXXX
    return localRegex.test(phone) || intlRegex.test(phone);
  };

  // 🔄 FORMAT TO INTERNATIONAL
  const formatPhone = (phone) => {
    if (phone.startsWith("0")) {
      return "255" + phone.substring(1);
    }
    return phone;
  };

  const handlePay = async () => {
    if (loading) return; // 🚫 prevent double click

    if (!user) {
      alert("User not logged in ❌");
      return;
    }

    if (!method) {
      alert("Please select payment method");
      return;
    }

    if (!phone) {
      alert("Enter phone number");
      return;
    }

    // ✅ VALIDATION
    if (!validateTanzaniaPhone(phone)) {
      alert("Enter valid Tanzanian number (e.g. 07XXXXXXXX or 2557XXXXXXXX)");
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Sending payment request...");

      const response = await fetch("http://localhost:5000/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formatPhone(phone),
          method,
          amount: price,
          package: name,
          userId: user.id,
        }),
      });

      const data = await response.json();

      console.log("📥 PAYMENT RESPONSE:", data);

      // ❌ STOP if failed
      if (!data.success) {
        alert(data.message || "Payment failed");
        return;
      }

      // ✅ SUCCESS
      alert(data.message);

  // 🔥 Refresh profile (updates role → dalali)
  if (refreshProfile) {
    // 🔥 WAIT for profile to update
    await refreshProfile();

    // small delay to ensure state updates
    setTimeout(() => {
      navigate("/dalali-dashboard");
    }, 500);
  }
} catch (error) {
      console.error("🔥 PAYMENT ERROR:", error);
      alert("Payment failed. Check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Pay for {name} Package
        </h2>

        <p className="text-center mb-6 text-gray-600">
          Amount: Tsh {Number(price).toLocaleString()}
        </p>

        {/* Payment Methods */}
        <div className="space-y-3 mb-4">
          <button
            onClick={() => setMethod("mpesa")}
            disabled={loading}
            className={`w-full p-3 border rounded transition ${
              method === "mpesa"
                ? "bg-green-100 border-green-500"
                : "hover:bg-gray-50"
            }`}
          >
            M-Pesa
          </button>

          <button
            onClick={() => setMethod("tigopesa")}
            disabled={loading}
            className={`w-full p-3 border rounded transition ${
              method === "tigopesa"
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-50"
            }`}
          >
            Tigo Pesa
          </button>

          <button
            onClick={() => setMethod("airtel")}
            disabled={loading}
            className={`w-full p-3 border rounded transition ${
              method === "airtel"
                ? "bg-red-100 border-red-500"
                : "hover:bg-gray-50"
            }`}
          >
            Airtel Money
          </button>
        </div>

        {/* Phone Input */}
        <input
          type="tel"
          placeholder="07XXXXXXXX"
          maxLength={12}
          disabled={loading}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // numbers only
            setPhone(value);
          }}
        />

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className={`w-full p-3 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}