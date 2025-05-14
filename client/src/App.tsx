import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./Pages/LoginPage";
import QuestionsPage from "./Pages/QuestionsPage";
import SignUpPage from "./Pages/SignUpPage";
import WelcomePage from "./Pages/WelcomePage";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Search from "./Pages/Search";
import Cart from "./Pages/Cart";
import ProductPage from "./Pages/ProductPage";
import MainLayout from "./layouts/MainLayout";
import SellerVerification from "./Pages/SellerVerification";
import AdminDashboard from "./Pages/AdminDashboard";
import SellerSignup from "./Pages/SellerSignup";
import ShopFront from "./Pages/ShopFront";
import BuyerOrders from "./Pages/BuyerOrders";
import PaymentPage from "./Pages/PaymentPage";
import SearchPage from "./Pages/SearchPage";
import { SearchProvider } from "./components/SearchPageComp1/SearchContext";
import SellerLayout from "./layouts/SellerLayout";
import Footer from "./components/HomePageComp/Footer";
import EditProductPage from "./Pages/EditProductPage";
import AddProductPage from "./Pages/AddProductPage";
import UserReports from "./Pages/UserReports";
import SellerHome from "./Pages/SellerHome";
import StatsPage from "./Pages/SellerStatsPage";
import SellerOrdersPage from "./Pages/SellerOrdersPage";

function App() {
  return (
    <GoogleOAuthProvider clientId="719123023157-2l972akc1n9ktkksvlhajau4s9aclcng.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/LogInPage" element={<LoginPage />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          <Route path="/QuestionsPage" element={<QuestionsPage />} />
          <Route path="/Product/:id" element={<ProductPage />} />
          <Route path="/SellerVerification" element={<SellerVerification />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/UserReports" element={<UserReports />} />

          {/* Protected routes with MainLayout */}

          {/* Pages with MainLayout (includes NavBar & Footer) */}
          <Route element={<SellerLayout />}>
            <Route path="/SellerHome" element={<SellerHome />} />
            <Route path="/SellerStats" element={<StatsPage />} />
            <Route path="/SellerOrders" element={<SellerOrdersPage />} />
            <Route path="/SellerProfile" element={<SellerHome />} />
            <Route path="/EditProductPage/:id" element={<EditProductPage />} />
            <Route path="/AddProductPage" element={<AddProductPage />} />
          </Route>

          {/* For Pages with NavBar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/Home" element={<Home />} />
            <Route
              path="/SearchPage"
              element={
                <SearchProvider>
                  <SearchPage></SearchPage>
                </SearchProvider>
              }
            />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/seller-signup" element={<SellerSignup />} />
            <Route path="/shop/:username" element={<ShopFront />} />
            <Route path="/orders" element={<BuyerOrders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
