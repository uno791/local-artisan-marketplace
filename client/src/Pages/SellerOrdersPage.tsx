import React from "react";
import SellerOrders from "../components/SellerOrders/SellerOrders";
import NavBar from "../components/SellerHomeComp/NavBar";

const SellerOrdersPage: React.FC = () => {
  return (
    <main>
      {/* Navigation bar */}
      <NavBar />
      {/* Seller's orders listing */}
      <SellerOrders />
    </main>
  );
};

export default SellerOrdersPage;
