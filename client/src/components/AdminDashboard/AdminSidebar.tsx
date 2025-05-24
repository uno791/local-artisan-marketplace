import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../SellerVerificationPageComp/SellerVerification.module.css";

// admin sidebar navigation component
const AdminSidebar: React.FC = () => {
  const location = useLocation();

  // helper to check if link is currently active
  const isActive = (path: string) => location.pathname === path;

  return (
    // sidebar container
    <aside className={styles.sidebar}>
      {/* navigation links section */}
      <div className={styles.navGroup}>
        <h2>Admin Dashboard</h2>

        {/* link to sales analytics page */}
        <Link
          to="/AdminDashboard"
          className={`${styles.navItem} ${
            isActive("/AdminDashboard") ? styles.navItemActive : ""
          }`}
        >
          Sales Analytics
        </Link>

        {/* link to user reports page */}
        <Link
          to="/UserReports"
          className={`${styles.navItem} ${
            isActive("/UserReports") ? styles.navItemActive : ""
          }`}
        >
          User Reports
        </Link>

        {/* link to seller verification page */}
        <Link
          to="/SellerVerification"
          className={`${styles.navItem} ${
            isActive("/SellerVerification") ? styles.navItemActive : ""
          }`}
        >
          Seller Verification
        </Link>
      </div>

      {/* logout button section */}
      <div className={styles.logoutSection}>
        <Link to="/">
          <button
            className={styles.logoutButton}
            onClick={() => {
              localStorage.clear();
            }}
          >
            Log Out
            <span className={styles["arrow-wrapper"]}>
              <span className={styles.arrow}></span>
            </span>
          </button>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
