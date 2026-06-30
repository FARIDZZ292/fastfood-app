/**
 * App.jsx - Komponen root aplikasi FastFood.
 * 
 * Bertanggung jawab untuk:
 * - Mengatur semua routing aplikasi menggunakan React Router v7
 * - Membungkus seluruh aplikasi dengan CartProvider (Global State)
 * - Melindungi route admin dengan ProtectedAdminRoute
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// ── Komponen Pelindung Route ──
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// ── Halaman Auth Flow ──
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Verification from "./pages/Verification";

// ── Halaman Registrasi ──
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterCourier from "./pages/RegisterCourier";
import RegisterMerchant from "./pages/RegisterMerchant";

// ── Halaman Utama Aplikasi ──
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import SearchFilters from "./pages/SearchFilters";
import FoodItemDetail from "./pages/FoodItemDetail";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import OrderTracking from "./pages/OrderTracking";

// ── Halaman Admin ──
import AdminDashboard from "./pages/AdminDashboard";
import AdminPortal from "./pages/AdminPortal";
import AdminLogin from "./pages/AdminLogin";

// ── Halaman 404 ──
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    // CartProvider membungkus seluruh aplikasi agar state keranjang
    // bisa diakses dari halaman mana pun (Global State via Context API)
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Auth Flow ── */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/courier" element={<RegisterCourier />} />
          <Route path="/register/merchant" element={<RegisterMerchant />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verification" element={<Verification />} />

          {/* ── Main App ── */}
          <Route path="/home" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/search" element={<SearchFilters />} />
          {/* Dynamic route: :id diambil menggunakan useParams() di FoodItemDetail */}
          <Route path="/food/:id" element={<FoodItemDetail />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-tracking" element={<OrderTracking />} />

          {/* ── Admin Dashboard (dilindungi ProtectedAdminRoute) ── */}
          <Route path="/portalmasuk" element={<AdminPortal />} />
          <Route path="/portalmasuk/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              // Hanya bisa diakses jika admin sudah login (cek localStorage)
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* ── Route 404: Menangkap semua URL yang tidak terdaftar ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
