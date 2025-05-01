import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./Users/UserContext.tsx";
import StatsPage from "./Pages/SellerStatsPage.tsx";
import SellerHome from "./Pages/SellerHome.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
