"use client";

import React from "react";
import styles from "./MainContent.module.css";
import { StatisticsCard } from "./StatisticsCard";
import { SalesGraphCard } from "./SalesGraphCard";

export const MainContent: React.FC = () => {
  return (
    <main className={styles.mainContent}>
      <div className={styles.statisticsGrid}>
        <StatisticsCard value="R245,000" />
        <StatisticsCard value="R28,400" />
        <StatisticsCard value="R6,800" />
      </div>
      <SalesGraphCard />
    </main>
  );
};
