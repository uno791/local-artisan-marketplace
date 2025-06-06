import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./Users/UserContext.tsx";
import { ProfileProvider } from "./Users/ProfileContext.tsx";
import SellerOrdersPage from "./Pages/SellerOrdersPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </UserProvider>
  </StrictMode>
);
