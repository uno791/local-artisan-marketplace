import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Users/UserContext";
import { baseURL } from "../config";

import NavBar from "../components/SellerHomeComp/NavBar";
import ChartSelector from "../components/SellerStatsPageComp/ChartSelector";
import styles from "../components/SellerStatsPageComp/SellerStatsPage.module.css";

const StatsPage: React.FC = () => {
  const { user } = useUser();
  const username = user?.username || "";

  // State to store monthly and total revenue
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch sales trend data when username changes
  useEffect(() => {
    if (!username) return;

    axios
      .get(`${baseURL}/seller-sales-trends`, { params: { username } })
      .then((res) => {
        const data: number[] = res.data.data; // Monthly sales [Jan ... Dec]
        const idx = new Date().getMonth(); // Current month index (0-based)
        setMonthlyRevenue(data[idx] || 0);
        setTotalRevenue(data.reduce((a, b) => a + b, 0));
      })
      .catch(console.error);
  }, [username]);

  // Format currency in South African Rand
  const fmt = (n: number) => "R" + n.toLocaleString();

  return (
    <main className={styles.container}>
      <NavBar />

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

      {/* Chart selector component to display sales trends visually */}
      <ChartSelector />
    </main>
  );
};

export default StatsPage;
