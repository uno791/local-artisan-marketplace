// src/layouts/SellerLayout.tsx
import React from "react";
import Footer from "../components/HomePageComp/Footer";
import { Outlet } from "react-router-dom";

const SellerLayout: React.FC = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

export default SellerLayout;
