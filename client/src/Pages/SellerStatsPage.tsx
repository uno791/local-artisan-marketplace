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

  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  useEffect(() => {
    if (!username) return;
    axios
      .get(`${baseURL}/seller-sales-trends`, { params: { username } })
      .then((res) => {
        const data: number[] = res.data.data; // [Jan…Dec]
        const idx = new Date().getMonth(); // 0=Jan…11=Dec
        setMonthlyRevenue(data[idx] || 0);
        setTotalRevenue(data.reduce((a, b) => a + b, 0));
      })
      .catch(console.error);
  }, [username]);

  const fmt = (n: number) => "R" + n.toLocaleString();

  return (
    <div className={styles.container}>
      <NavBar />

      <div className={styles.statsHeader}>
        <div className={styles.card}>
          <p>Monthly Sales</p>
          <h3>{fmt(monthlyRevenue)}</h3>
        </div>
        <div className={styles.card}>
          <p>Total Revenue</p>
          <h3>{fmt(totalRevenue)}</h3>
        </div>
      </div>

      <ChartSelector />
    </div>
  );
};

export default StatsPage;
