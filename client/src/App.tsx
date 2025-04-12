import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./Pages/LoginPage";
import QuestionsPage from "./Pages/QuestionsPage";
import SignUpPage from "./Pages/SignUpPage";
import WelcomePage from "./Pages/WelcomePage";

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
  );
}

export default App;
