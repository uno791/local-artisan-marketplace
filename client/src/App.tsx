import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./Pages/LoginPage";
import QuestionsPage from "./Pages/QuestionsPage";
import SignUpPage from "./Pages/SignUpPage";
import WelcomePage from "./Pages/WelcomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
// import UserTable from "./components/UserTable"; // 🟡 Temporarily disabled

function App() {
  return (
    //DO NOT TOUCH
    <GoogleOAuthProvider clientId="719123023157-2l972akc1n9ktkksvlhajau4s9aclcng.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          <Route path="/LogInPage" element={<LoginPage />} />
          <Route path="/QuestionsPage" element={<QuestionsPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        {/* 
        

        <Route
          path="/admin/users"
          element={
            <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
              <h1>Local Artisan Marketplace</h1>
              <h2>User List</h2>
              <UserTable />
            </div>
          }
        />
        */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
