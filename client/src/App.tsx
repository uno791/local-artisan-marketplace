import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./Pages/LoginPage";
import QuestionsPage from "./Pages/QuestionsPage";
import SignUpPage from "./Pages/SignUpPage";
import WelcomePage from "./Pages/WelcomePage";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import Cart from "./Pages/Cart";
import Profile from "./Pages/Profile";
import ProductPage from "./Page/ProductPage";
import Footer from "./components/Footer";
// import UserTable from "./components/UserTable"; // 🟡 Temporarily disabled

function App() {
  return (
    //DO NOT TOUCH
    <GoogleOAuthProvider clientId="719123023157-2l972akc1n9ktkksvlhajau4s9aclcng.apps.googleusercontent.com">
      {/* can touch */}
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          <Route path="/LogInPage" element={<LoginPage />} />
          <Route path="/QuestionsPage" element={<QuestionsPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
