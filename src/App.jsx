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
import Rooms from "./pages/Rooms"
import Bookings from "./pages/Bookings"
import Notifications from "./pages/Notifications"
import Account from "./pages/Account"
import Support from "./pages/Support"
import Pricing from "./pages/Pricing"
import AdminUsers from "./pages/AdminUsers"

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

<Route path="/rooms" element={<Rooms />} />
<Route path="/bookings" element={<Bookings />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/account" element={<Account />} />
<Route path="/support" element={<Support />} />
<Route path="/pricing" element={<Pricing />} />
<Route
path="/admin-users"element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>
  }
/>
      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App