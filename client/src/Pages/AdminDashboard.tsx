"use client";

import React from "react";
import { DashboardSidebar } from "../components/AdminDashboard/DashboardSidebar";
import { MainContent } from "../components/AdminDashboard/MainContent";
import styles from "../components/AdminDashboard/AdminDashboard.module.css";


export const AdminDashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <aside className={styles.sidebarContainer}>
          <DashboardSidebar />
        </aside>
        <div className={styles.mainContainer}>
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
