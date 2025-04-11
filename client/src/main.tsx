import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import WelcomePage from "./components/WelcomePageComponents/WelcomePage.tsx";
import AuthPage from "./components/signupcomponents/AuthPage.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WelcomePage />
  </StrictMode>
);
