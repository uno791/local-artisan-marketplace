import React from "react";
import SellerOrders from "../components/SellerOrders/SellerOrders";
import NavBar from "../components/SellerHomeComp/NavBar";

const SellerOrdersPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <SellerOrders />
    </div>
  );
};

export default SellerOrdersPage;
