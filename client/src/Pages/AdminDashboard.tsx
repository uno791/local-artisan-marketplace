"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import StatsCard from "../components/AdminDashboard/StatsCard";
import GraphCard from "../components/AdminDashboard/GraphCard";

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2>Admin Dashboard</h2>

        <Link
          to="/AdminDashboard"
          className={`${styles.navItem} ${isActive("/AdminDashboard") ? styles.navItemActive : ""}`}
        >
          Sales Analytics
        </Link>

        <Link
          to="#"
          className={`${styles.navItem} ${isActive("/UserReports") ? styles.navItemActive : ""}`}
        >
          User Reports
        </Link>

        <Link
          to="/SellerVerification"
          className={`${styles.navItem} ${isActive("/SellerVerification") ? styles.navItemActive : ""}`}
        >
          Seller Verification
        </Link>
      </div>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            // marginBottom: "8px",
            width: "100%",
          }}
        >
          <StatsCard label="Total Sales" value="R245,000" />
          <StatsCard label="Monthly Sales" value="R28,400" />
          <StatsCard label="Weekly Sales" value="R6,800" />
        </div>

        {/* Graph Below */}
        <div style={{ width: "100%" }}>
          <GraphCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
