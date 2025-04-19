import React, { useState } from "react";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import SellerCard from "../components/SellerVerificationPageComp/SellerCard";
import { Seller } from "../Types";

const initialSellers: Seller[] = [
  {
    id: "1",
    name: "Artisan Crafts Co",
    businessType: "Home Decor - LLC",
    description: "Handcrafted rustic decor items.",
    contactEmail: "contact@artisancrafts.com",
    contactPhone: "+27 152 567 4457",
    owner: "Maria Rodriguez",
    status: "Pending",
    submissionDate: "2025-02-25",
    documentsSubmitted: true,
  },
  {
    id: "2",
    name: "Vintage Treasures",
    businessType: "Online Store",
    description: "A boutique of retro vintage items.",
    contactEmail: "info@vintagetreasures.com",
    contactPhone: "+27 105 893 2356",
    owner: "James Thompson",
    status: "Reviewing",
    submissionDate: "2025-04-14",
    documentsSubmitted: true,
  },
];

const SellerVerification: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);

  const updateSellerStatus = (id: string, status: Seller["status"]) => {
    if (status === "Approved" || status === "Rejected") {
      // Remove from list
      setSellers((prev) => prev.filter((s) => s.id !== id));
    } else {
      // Just update status
      setSellers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    }
  };

  const activeTab = "Seller Verification";

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        {/* <a
          href="#"
          className={`${styles.navItem} ${
            activeTab === "Admin Dashboard" ? styles.navItemActive : ""
          }`}
        >
          Sales Analytics
        </a>
        <a
          href="#"
          className={`${styles.navItem} ${
            activeTab === "User Reports" ? styles.navItemActive : ""
          }`}
        >
          User Reports
        </a> */}
        <a
          href="#"
          className={`${styles.navItem} ${
            activeTab === "Seller Verification" ? styles.navItemActive : ""
          }`}
        >
          Seller Verification
        </a>
      </div>

      <div className={styles.container}>
        <h1>Seller Verification</h1>
        <div className={styles.cards}>
          {sellers.map((seller) => (
            <SellerCard
              key={seller.id}
              seller={seller}
              onStartReview={() => updateSellerStatus(seller.id, "Reviewing")}
              onApprove={() => updateSellerStatus(seller.id, "Approved")}
              onReject={() => updateSellerStatus(seller.id, "Rejected")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerVerification;
