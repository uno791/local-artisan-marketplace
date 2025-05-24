import React, { useEffect, useRef, useState } from "react";
import type { ChartData } from "chart.js";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import StatsCard from "../components/AdminDashboard/StatsCard";
import GraphCard from "../components/AdminDashboard/GraphCard";
import Export from "../components/AdminDashboard/Export";
import { baseURL } from "../config";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar";

interface SalesRow {
  month: number;
  monthName: string;
  total: number;
}

export const AdminDashboard: React.FC = () => {
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
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentRow = salesRows.find((r) => r.month === currentMonth);
  const monthlySales = currentRow?.total ?? 0;
  const fmt = (n: number) =>
    "R" + n.toLocaleString("en-ZA", { minimumFractionDigits: 0 });

  return (
    <div className={styles.wrapper}>
      <AdminSidebar />
      <div className={styles.container}>
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