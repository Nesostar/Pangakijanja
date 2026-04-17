import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import CustomerDashboard from "./pages/CustomerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import DalaliDashboard from "./pages/DalaliDashboard"
import Upgrade from "./pages/Upgrade"
import Payment from "./pages/Payment"
import PaymentSuccess from "./pages/PaymentSuccess"
import AddRoom from "./pages/AddRoom"
import Listings from "./pages/Listings"
import Analytics from "./pages/Analytics"
import Featured from "./pages/Featured"

// Components
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* CUSTOMER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* DALALI DASHBOARD */}
      <Route
        path="/dalali-dashboard"
        element={
          <ProtectedRoute>
            <DalaliDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* UPGRADE */}
      <Route
        path="/upgrade"
        element={
          <ProtectedRoute>
            <Upgrade />
          </ProtectedRoute>
        }
      />

      {/* PAYMENT */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />

      {/* PAYMENT SUCCESS (public or protected depending on your choice) */}
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* ADD ROOM */}
      <Route
        path="/add-room"
        element={
          <ProtectedRoute>
            <AddRoom />
          </ProtectedRoute>
        }
      />

      {/* LISTINGS */}
      <Route
        path="/listings"
        element={
          <ProtectedRoute>
            <Listings />
          </ProtectedRoute>
        }
      />

      {/* ANALYTICS */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* FEATURED */}
      <Route
        path="/featured"
        element={
          <ProtectedRoute>
            <Featured />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App