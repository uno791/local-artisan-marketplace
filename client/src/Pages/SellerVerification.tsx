import React, { useState, useEffect } from "react";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import SellerCard from "../components/SellerVerificationPageComp/SellerCard";
import { Seller } from "../Users";
import axios from "axios";
import { baseURL } from "../config";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar";

const SellerVerification: React.FC = () => {
  // State to hold list of sellers pending verification
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Fetch pending artisans from backend API
  const fetchPendingSellers = async () => {
    try {
      const res = await axios.get(`${baseURL}/penartisans`);
      setSellers(res.data);
    } catch (err) {
      console.error("❌ Error fetching artisans:", err);
    }
  };

  // Delete artisan by username
  const deleteArtisan = async (username: string) => {
    try {
      const res = await axios.delete(`${baseURL}/deleteartisan/${username}`);
      console.log("✅", res.data.message);
    } catch (err) {
      console.error("❌ Error deleting artisan:", err);
    }
  };

  // Verify artisan by username
  const verifyArtisan = async (username: string) => {
    try {
      const res = await axios.put(`${baseURL}/verifyartisan/${username}`);
      console.log("✅", res.data.message);
    } catch (err) {
      console.error("❌ Error verifying artisan:", err);
    }
  };

  // Load pending sellers on mount
  useEffect(() => {
    fetchPendingSellers();
  }, []);

  // Update local seller status and trigger backend action accordingly
  const updateSellerStatus = (username: string, status: number) => {
    // Status mapping: 1 -> Start Review, 2 -> Approve, 3 -> Reject
    if (status - 1 === 1) verifyArtisan(username);
    if (status - 1 === 2) deleteArtisan(username);

    // Update state optimistically to reflect status change
    setSellers((prev) =>
      prev.map((s) =>
        s.username === username ? { ...s, verified: status } : s
      )
    );
  };

  return (
    <main className={styles.wrapper}>
      <AdminSidebar />
      <section className={styles.container}>
        <h1 data-testid="seller-verification-title">Seller Verification</h1>
        <section className={styles.cards}>
          {/* Filter sellers to those with verification status <= 3 */}
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
