import React, { useEffect, useRef, useState } from "react";
import type { ChartData } from "chart.js";
import styles from "../components/SellerVerificationPageComp/SellerVerification.module.css";
import StatsCard from "../components/AdminDashboard/StatsCard";
import GraphCard from "../components/AdminDashboard/GraphCard";
import Export from "../components/AdminDashboard/Export";
import { baseURL } from "../config";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar";

// type definition for sales data row
interface SalesRow {
  month: number;
  monthName: string;
  total: number;
}

// main admin dashboard component
export const AdminDashboard: React.FC = () => {
  // reference to the chart element for export
  const chartRef = useRef<HTMLDivElement>(null);

  // state for raw sales data
  const [salesRows, setSalesRows] = useState<SalesRow[]>([]);

  // state for chart.js data format
  const [chartData, setChartData] = useState<
    ChartData<"line", number[], string>
  >({
    labels: [],
    datasets: [],
  });

  // fetch sales data on mount and set chart data
  useEffect(() => {
    fetch(`${baseURL}/sales-data`)
      .then((res) => res.json())
      .then((rows: SalesRow[]) => {
        setSalesRows(rows);

        // prepare labels and data for the chart
        const labels = rows.map((r) => r.monthName);
        const data = rows.map((r) => r.total);

        // set chart data state
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

  // calculate total sales
  const totalSales = salesRows.reduce((sum, r) => sum + r.total, 0);

  // determine current month sales
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentRow = salesRows.find((r) => r.month === currentMonth);
  const monthlySales = currentRow?.total ?? 0;

  // format number as currency
  const fmt = (n: number) =>
    "R" + n.toLocaleString("en-ZA", { minimumFractionDigits: 0 });

  return (
    <div className={styles.wrapper}>
      <AdminSidebar />
      <div className={styles.container}>
        {/* sales summary cards */}
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

        {/* sales chart and export options */}
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
