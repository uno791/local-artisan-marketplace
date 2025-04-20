import React, { useState } from "react";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import SellerCard from "../components/SellerVerificationPageComp/SellerCard";
import { Seller } from "../Users";
import { Link } from "react-router-dom";

const initialSellers: Seller[] = [
  {
    username: "maria_r",
    shop_name: "Artisan Crafts Co",
    bio: "Handcrafted rustic decor items.",
    shop_pfp: "https://via.placeholder.com/64",
    shop_banner: "https://via.placeholder.com/300x100",
    shop_address: "123 Market Street, Cape Town",
    verified: 0,
    create_date: "2025-02-25",
  },
  {
    username: "james_t",
    shop_name: "Vintage Treasures",
    bio: "A boutique of retro vintage items.",
    shop_pfp: "https://via.placeholder.com/64",
    shop_banner: "https://via.placeholder.com/300x100",
    shop_address: "456 Retro Blvd, Johannesburg",
    verified: 1,
    create_date: "2025-04-14",
  },
];

const SellerVerification: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);

  const updateSellerStatus = (username: string, status: number) => {
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
        <h1>Seller Verification</h1>
        <div className={styles.cards}>
          {sellers
            .filter((s) => s.verified === 0 || s.verified === 1)
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
