import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ActionButtons from "./components/Welcome page Comp/WelcomePage.tsx";
import WelcomePage from "./components/Welcome page Comp/WelcomePage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WelcomePage />
  </StrictMode>
  
);
