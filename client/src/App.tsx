import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./Pages/LoginPage";
import QuestionsPage from "./Pages/QuestionsPage";
import SignUpPage from "./Pages/SignUpPage";
import WelcomePage from "./Pages/WelcomePage";
import NavBar from "./components/HomePageComp/NavBar";
import Footer from "./components/HomePageComp/Footer";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Search from "./Pages/Search";
import Cart from "./Pages/Cart";
//import { BrowserRouter } from "react-router-dom";
//import NavBar from "./components/NavBar";

// import UserTable from "./components/UserTable"; // 🟡 Temporarily disabled

function AppLayout() {
  const location = useLocation();
  const hideNavFooterOn = ["/", "/LogInPage", "/SignUpPage", "/QuestionsPage"];
  const shouldHide = hideNavFooterOn.includes(location.pathname);

  return (
    <>
      {!shouldHide && <NavBar />}

      <Routes>
        {/* Auth / Onboarding Pages */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/LogInPage" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/QuestionsPage" element={<QuestionsPage />} />

        {/* Main App Pages */}
        <Route path="/Home" element={<Home />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>

      {!shouldHide && <Footer />}
    </>
  );
}

function App() {
  return (
    // DO NOT TOUCH
    <GoogleOAuthProvider clientId="719123023157-2l972akc1n9ktkksvlhajau4s9aclcng.apps.googleusercontent.com">
      {/* can touch */}
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
