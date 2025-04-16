import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./Pages/LoginPage";
import QuestionsPage from "./Pages/QuestionsPage";
import SignUpPage from "./Pages/SignUpPage";
import WelcomePage from "./Pages/WelcomePage";
import ProductPage from "./Pages/ProductPage";
//import { BrowserRouter } from "react-router-dom";
//import NavBar from "./components/NavBar";

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
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
