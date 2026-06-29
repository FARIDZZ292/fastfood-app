import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Verification from "./pages/Verification";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import SearchFilters from "./pages/SearchFilters";
import FoodItemDetail from "./pages/FoodItemDetail";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import OrderTracking from "./pages/OrderTracking";

// New Pages
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterCourier from "./pages/RegisterCourier";
import RegisterMerchant from "./pages/RegisterMerchant";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPortal from "./pages/AdminPortal";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
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
          <Route path="/food/:id" element={<FoodItemDetail />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          
          {/* ── Admin Dashboard ── */}
          <Route path="/portalmasuk" element={<AdminPortal />} />
          <Route path="/portalmasuk/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
