// import necessary libraries and components
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Users/UserContext";
import { baseURL } from "../config";

import NavBar from "../components/SellerHomeComp/NavBar";
import ChartSelector from "../components/SellerStatsPageComp/ChartSelector";
import styles from "../components/SellerStatsPageComp/SellerStatsPage.module.css";

// main stats page component
const StatsPage: React.FC = () => {
  // get current user
  const { user } = useUser();
  const username = user?.username || "";

  // state to store revenue values
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // fetch sales trend data from backend
  useEffect(() => {
    if (!username) return;

    axios
      .get(`${baseURL}/seller-sales-trends`, { params: { username } })
      .then((res) => {
        const data: number[] = res.data.data; // array of monthly sales
        const idx = new Date().getMonth(); // get current month index
        setMonthlyRevenue(data[idx] || 0); // set this month’s revenue
        setTotalRevenue(data.reduce((a, b) => a + b, 0)); // total revenue
      })
      .catch(console.error);
  }, [username]);

  // helper function to format numbers as currency
  const fmt = (n: number) => "R" + n.toLocaleString();

  return (
    <main className={styles.container}>
      {/* seller navbar */}
      <NavBar />

      {/* revenue summary header */}
      <header className={styles.statsHeader}>
        <section className={styles.card}>
          <p>Monthly Sales</p>
          <h3>{fmt(monthlyRevenue)}</h3>
        </section>
        <section className={styles.card}>
          <p>Total Revenue</p>
          <h3>{fmt(totalRevenue)}</h3>
        </section>
      </header>

      {/* chart view selector component */}
      <ChartSelector />
    </main>
  );
};

export default StatsPage;
