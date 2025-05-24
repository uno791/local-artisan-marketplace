// import dependencies and components
import React, { useState, useEffect } from "react";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import SellerCard from "../components/SellerVerificationPageComp/SellerCard";
import { Seller } from "../Users";
import axios from "axios";
import { baseURL } from "../config";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar";

// seller verification page for admin
const SellerVerification: React.FC = () => {
  // state for list of sellers
  const [sellers, setSellers] = useState<Seller[]>([]);

  // fetch pending sellers from backend
  const fetchPendingSellers = async () => {
    try {
      const res = await axios.get(`${baseURL}/penartisans`);
      setSellers(res.data);
    } catch (err) {
      console.error("❌ Error fetching artisans:", err);
    }
  };

  // delete seller from backend
  const deleteArtisan = async (username: string) => {
    try {
      const res = await axios.delete(`${baseURL}/deleteartisan/${username}`);
      console.log("✅", res.data.message);
    } catch (err) {
      console.error("❌ Error deleting artisan:", err);
    }
  };

  // mark seller as verified in backend
  const verifyArtisan = async (username: string) => {
    try {
      const res = await axios.put(`${baseURL}/verifyartisan/${username}`);
      console.log("✅", res.data.message);
    } catch (err) {
      console.error("❌ Error verifying artisan:", err);
    }
  };

  // fetch seller list on mount
  useEffect(() => {
    fetchPendingSellers();
  }, []);

  // update seller status in UI and backend
  const updateSellerStatus = (username: string, status: number) => {
    if (status - 1 === 1) verifyArtisan(username); // approve
    if (status - 1 === 2) deleteArtisan(username); // reject
    setSellers((prev) =>
      prev.map((s) =>
        s.username === username ? { ...s, verified: status } : s
      )
    );
  };

  return (
    <main className={styles.wrapper}>
      {/* sidebar for admin navigation */}
      <AdminSidebar />

      {/* main content container */}
      <section className={styles.container}>
        <h1 data-testid="seller-verification-title">Seller Verification</h1>

        {/* display seller cards that need review */}
        <section className={styles.cards}>
          {sellers
            .filter((s) => s.verified <= 3)
            .map((seller) => (
              <SellerCard
                key={seller.username}
                seller={seller}
                onStartReview={() => updateSellerStatus(seller.username, 1)}
                onApprove={() => updateSellerStatus(seller.username, 2)}
                onReject={() => updateSellerStatus(seller.username, 3)}
              />
            ))}
        </section>
      </section>
    </main>
  );
};

export default SellerVerification;
