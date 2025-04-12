import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ActionButtons from "./Pages/WelcomePage.tsx";
import WelcomePage from "./Pages/WelcomePage.tsx";
import SignUpPage from "./Pages/SignUpPage.tsx";
import QuestionsPage from "./Pages/QuestionsPage.tsx";
import LoginPage from "./Pages/LoginPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
