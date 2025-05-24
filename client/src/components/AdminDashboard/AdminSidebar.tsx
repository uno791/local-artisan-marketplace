import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../SellerVerificationPageComp/SellerVerification.module.css";

// component definition
const AdminSidebar: React.FC = () => {
  // get current route
  const location = useLocation();

  // check if route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.navGroup}>
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
