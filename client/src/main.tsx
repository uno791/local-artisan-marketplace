import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ActionButtons from "./components/WelcomePageComp/WelcomePage.tsx";
import WelcomePage from "./components/WelcomePageComp/WelcomePage.tsx";
import SignUpPage from "./components/SignUpPageComp/SignUpPage.tsx";
import QuestionsPage from "./components/QuestionsPageComp/QuestionsPage.tsx";
import LoginPage from "./components/LogInPageComp/LoginPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QuestionsPage />
  </StrictMode>
);
