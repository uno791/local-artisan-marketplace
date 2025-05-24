import React from "react";
import SellerOrders from "../components/SellerOrders/SellerOrders";
import NavBar from "../components/SellerHomeComp/NavBar";

const SellerOrdersPage: React.FC = () => {
  return (
    <main>
      <NavBar />
      <SellerOrders />
    </main>
  );
};

export default SellerOrdersPage;
