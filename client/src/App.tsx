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
import SellerSignup from "./Pages/SellerSignup";


// import UserTable from "./components/UserTable"; // 🟡 Temporarily disabled

function App() {
  return (
    // DO NOT TOUCH
    <GoogleOAuthProvider clientId="719123023157-2l972akc1n9ktkksvlhajau4s9aclcng.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          {/* For Pages with NavBar and Footer */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/LogInPage" element={<LoginPage />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          <Route path="/QuestionsPage" element={<QuestionsPage />} />
          <Route path="/Product/:id" element={<ProductPage />} />
          <Route path="/seller-signup" element={<SellerSignup />} />


          {/* For Pages with NavBar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/Search" element={<Search />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/seller-signup" element={<SellerSignup />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
