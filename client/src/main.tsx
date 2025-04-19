import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./Users/UserContext.tsx";
import SellerVerification from "./Pages/SellerVerification.tsx";
import AdminDashboard from "./Pages/AdminDashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
