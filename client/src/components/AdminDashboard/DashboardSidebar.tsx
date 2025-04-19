"use client";

import React from "react";
import styles from "./DashboardSidebar.module.css";

export const DashboardSidebar: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <ul className={styles.menu}>
        <li>
          <button className={styles.menuItem}>Sales Analytics</button>
        </li>
        <li>
          <button className={styles.menuItem}>User Reports</button>
        </li>
        <li>
          <button className={styles.menuItem}>Seller Verification</button>
        </li>
      </ul>
    </nav>
  );
};
