import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import StatsCard from "../components/AdminDashboard/StatsCard";
import GraphCard from "../components/AdminDashboard/GraphCard";
import Export from "../components/AdminDashboard/Export";

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const chartRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2>Admin Dashboard</h2>

        <Link
          to="/AdminDashboard"
          className={`${styles.navItem} ${
            isActive("/AdminDashboard") ? styles.navItemActive : ""
          }`}
        >
          Sales Analytics
        </Link>

        <Link
          to="/UserReports"
          className={`${styles.navItem} ${
            isActive("/UserReports") ? styles.navItemActive : ""
          }`}
        >
          User Reports
        </Link>

        <Link
          to="/SellerVerification"
          className={`${styles.navItem} ${
            isActive("/SellerVerification") ? styles.navItemActive : ""
          }`}
        >
          Seller Verification
        </Link>
      </div>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <StatsCard label="Total Sales" value="R245,000" />
          <StatsCard label="Monthly Sales" value="R28,400" />
          <StatsCard label="Weekly Sales" value="R6,800" />
        </div>

        <div style={{ width: "100%", marginTop: 20 }}>
          <GraphCard ref={chartRef} />

          <Export chartRef={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
