// src/components/SellerStatsPageComp/ChartSelector.tsx
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useUser } from "../../Users/UserContext";
import { baseURL } from "../../config";
import SalesTrendsChart from "./SalesTrendsChart";
import InventoryStatusChart from "./InventoryStatusChart";
import styles from "./ChartSelector.module.css";

export type ChartKey = "salesTrends" | "inventoryStatus";

// Map month numbers (1–12) to short names
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ChartSelector: React.FC = () => {
  const { user } = useUser();
  const username = user?.username || "";

  const [chartKey, setChartKey] = useState<ChartKey>("salesTrends");
  const [months, setMonths] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [stockData, setStockData] = useState<number[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  // Whenever user or chartKey changes, fetch the right data
  useEffect(() => {
    if (!username) return;
    const endpoint =
      chartKey === "salesTrends"
        ? "/seller-sales-trends"
        : "/seller-inventory-status";

    axios
      .get(`${baseURL}${endpoint}`, { params: { username } })
      .then((res) => {
        if (chartKey === "salesTrends") {
          // res.data.months is [1,2,3,...]
          const nums: number[] = res.data.months;
          // convert to ["Jan","Feb",...]
          const labels = nums.map((m) => MONTH_NAMES[m - 1] || "");
          setMonths(labels);
          setSalesData(res.data.data);
        } else {
          setProducts(res.data.products);
          setStockData(res.data.data);
        }
      })
      .catch((err) => {
        console.error("❌ Chart data fetch error:", err);
      });
  }, [username, chartKey]);

  // PDF export
  const exportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "px", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`${chartKey}.pdf`);
  };

  // CSV export
  const exportCSV = () => {
    const rows =
      chartKey === "salesTrends"
        ? [
            ["Month", ...months],
            ["Revenue", ...salesData.map((n) => n.toString())],
          ]
        : [
            ["Product", "Stock"],
            ...products.map((p, i) => [p, stockData[i].toString()]),
          ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chartKey}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.controls}>
        <select
          className={styles.select}
          value={chartKey}
          onChange={(e) => setChartKey(e.target.value as ChartKey)}
        >
          <option value="salesTrends">Sales Trends</option>
          <option value="inventoryStatus">Inventory Status</option>
        </select>
        <button onClick={exportPDF} className={styles.button}>
          Export as PDF
        </button>
        <button onClick={exportCSV} className={styles.button}>
          Export as CSV
        </button>
      </div>

      <div ref={chartRef} className={styles.chartWrapper}>
        {chartKey === "salesTrends" ? (
          <SalesTrendsChart months={months} data={salesData} />
        ) : (
          <InventoryStatusChart products={products} data={stockData} />
        )}
      </div>
    </div>
  );
};

export default ChartSelector;
