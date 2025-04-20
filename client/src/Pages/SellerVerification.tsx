import React, { useState, useEffect } from "react";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import SellerCard from "../components/SellerVerificationPageComp/SellerCard";
import { Seller } from "../Users";
import axios from "axios";

// const initialSellers: Seller[] = [
//   {
//     username: "maria_r",
//     shop_name: "Artisan Crafts Co",
//     bio: "Handcrafted rustic decor items.",
//     shop_pfp: "https://via.placeholder.com/64",
//     shop_banner: "https://via.placeholder.com/300x100",
//     shop_address: "123 Market Street, Cape Town",
//     verified: 0,
//     create_date: "2025-02-25",
//   },
//   {
//     username: "james_t",
//     shop_name: "Vintage Treasures",
//     bio: "A boutique of retro vintage items.",
//     shop_pfp: "https://via.placeholder.com/64",
//     shop_banner: "https://via.placeholder.com/300x100",
//     shop_address: "456 Retro Blvd, Johannesburg",
//     verified: 1,
//     create_date: "2025-04-14",
//   },
// ];
const baseURL = import.meta.env.VITE_API_BASE_URL;
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
        <a href="#" className={styles.navItem}>
          Sales Analytics
        </a>
        <a href="#" className={styles.navItem}>
          User Reports
        </a>
        <a href="#" className={`${styles.navItem} ${styles.navItemActive}`}>
          Seller Verification
        </a>
      </div>

      <div className={styles.container}>
        <h1>Seller Verification</h1>
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
