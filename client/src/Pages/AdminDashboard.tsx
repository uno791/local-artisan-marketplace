import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { ChartData } from "chart.js";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import StatsCard from "../components/AdminDashboard/StatsCard";
import GraphCard from "../components/AdminDashboard/GraphCard";
import Export from "../components/AdminDashboard/Export";
import { baseURL } from "../config";
interface SalesRow {
  month: number;
  monthName: string;
  total: number;
}

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const chartRef = useRef<HTMLDivElement>(null);
  const [salesRows, setSalesRows] = useState<SalesRow[]>([]);
  const [chartData, setChartData] = useState<
    ChartData<"line", number[], string>
  >({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetch(`${baseURL}/sales-data`)
      .then((res) => res.json())
      .then((rows: SalesRow[]) => {
        setSalesRows(rows);
        const labels = rows.map((r) => r.monthName);
        const data = rows.map((r) => r.total);
        setChartData({
          labels,
          datasets: [
            {
              label: "Monthly Sales",
              data,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.2,
            },
          ],
        });
      })
      .catch((err) => console.error("Failed to load sales data:", err));
  }, []);

  const totalSales = salesRows.reduce((sum, r) => sum + r.total, 0);

  // compute this Month’s Sales
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JS: 0 = Jan
  const currentRow = salesRows.find((r) => r.month === currentMonth);
  const monthlySales = currentRow?.total ?? 0;

  const fmt = (n: number) =>
    "R" + n.toLocaleString("en-ZA", { minimumFractionDigits: 0 });

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
          <StatsCard label="Total Sales" value={fmt(totalSales)} />
          <StatsCard label="Monthly Sales" value={fmt(monthlySales)} />
        </div>

        <div style={{ width: "100%", marginTop: 20 }}>
          <GraphCard ref={chartRef} data={chartData} />
          {chartData.datasets.length > 0 && (
            <Export chartRef={chartRef} data={chartData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
