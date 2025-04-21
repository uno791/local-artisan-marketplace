import React, { useState, useEffect } from "react";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import SellerCard from "../components/SellerVerificationPageComp/SellerCard";
import { Seller } from "../Users";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";

const SellerVerification: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);

  const fetchPendingSellers = async () => {
    try {
      const res = await axios.get(`${baseURL}/penartisans`);
      setSellers(res.data);
    } catch (err) {
      console.error("❌ Error fetching artisans:", err);
    }
  };

  const deleteArtisan = async (username: string) => {
    try {
      const res = await axios.delete(`${baseURL}/deleteartisan/${username}`);
      console.log("✅", res.data.message);
    } catch (err) {
      console.error("❌ Error deleting artisan:", err);
    }
  };

  const verifyArtisan = async (username: string) => {
    try {
      const res = await axios.put(`${baseURL}/verifyartisan/${username}`);
      console.log("✅", res.data.message);
    } catch (err) {
      console.error("❌ Error verifying artisan:", err);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const updateSellerStatus = (username: string, status: number) => {
    if (status - 1 === 1) verifyArtisan(username);
    if (status - 1 === 2) deleteArtisan(username);
    setSellers((prev) =>
      prev.map((s) =>
        s.username === username ? { ...s, verified: status } : s
      )
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        <Link to="/AdminDashboard" className={styles.navItem}>
          Sales Analytics
        </Link>

        <Link to="#" className={styles.navItem}>
          User Reports
        </Link>

        <Link
          to="/SellerVerification"
          className={`${styles.navItem} ${styles.navItemActive}`}
        >
          Seller Verification
        </Link>
      </div>

      <div className={styles.container}>
      <h1 data-testid="seller-verification-title">Seller Verification</h1>
        <div className={styles.cards}>
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
        </div>
      </div>
    </div>
  );
};

export default SellerVerification;
