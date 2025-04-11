import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import WelcomePage from "./components/WelcomePageComp/WelcomePage.tsx";
import SignUpPage from "./components/SignUpComp/SignUpPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SignUpPage />
  </StrictMode>
);
