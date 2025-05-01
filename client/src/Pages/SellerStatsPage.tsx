import React from "react";
import NavBar from "../components/SellerHomeComp/NavBar";
import StatsChart from "../components/SellerStatsPageComp/StatsChart";
import styles from "../components/SellerStatsPageComp/SellerStatsPage.module.css";
import { BrowserRouter } from "react-router-dom";

const StatsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <NavBar />

      <div className={styles.statsHeader}>
        <div className={styles.card}>
          <p>Monthly Sales</p>
          <h3>R28,400</h3>
        </div>
        <div className={styles.card}>
          <p>Total Revenue</p>
          <h3>R100,400</h3>
        </div>
        <div className={styles.card}>
          <p> all-time</p>
          <h3>R900,400</h3>
        </div>
      </div>
      <StatsChart />
      <div className={styles.rating}>
        <strong>Store Rating:</strong> ⭐⭐⭐⭐⭐
      </div>
    </div>
  );
};

export default StatsPage;
