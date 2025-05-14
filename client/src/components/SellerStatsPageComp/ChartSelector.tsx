// src/components/SellerStatsPageComp/ChartSelector.tsx
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useUser } from "../../Users/UserContext";
import { baseURL } from "../../config";
import SalesTrendsChart from "./SalesTrendsChart";
import InventoryStatusChart from "./InventoryStatusChart";
import TopProductsPieChart from "./TopProductsPieChart";
import styles from "./ChartSelector.module.css";

export type ChartKey = "salesTrends" | "inventoryStatus" | "topProducts";

const ChartSelector: React.FC = () => {
  const { user } = useUser();
  const username = user?.username || "";

  const [chartKey, setChartKey] = useState<ChartKey>("salesTrends");
  const [months, setMonths] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [stockData, setStockData] = useState<number[]>([]);
  const [unitsSold, setUnitsSold] = useState<number[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username) return;
    let endpoint: string;
    switch (chartKey) {
      case "salesTrends":
        endpoint = "/seller-sales-trends";
        break;
      case "inventoryStatus":
        endpoint = "/seller-inventory-status";
        break;
      case "topProducts":
        endpoint = "/seller-top-products";
        break;
    }

    axios
      .get(`${baseURL}${endpoint}`, { params: { username } })
      .then((res) => {
        if (chartKey === "salesTrends") {
          if (chartKey === "salesTrends") {
            const monthNames = [
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
            const convertedMonths = res.data.months.map(
              (m: number) => monthNames[m - 1]
            );
            setMonths(convertedMonths);
            setSalesData(res.data.data);
          }
        } else if (chartKey === "inventoryStatus") {
          setProducts(res.data.products);
          setStockData(res.data.data);
        } else if (chartKey === "topProducts") {
          setProducts(res.data.productNames);
          setUnitsSold(res.data.unitsSold);
        }
      })
      .catch(console.error);
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
    let rows: string[][];
    if (chartKey === "salesTrends") {
      rows = [
        ["Month", ...months],
        ["Revenue", ...salesData.map(String)],
      ];
    } else if (chartKey === "inventoryStatus") {
      rows = [
        ["Product", "Stock"],
        ...products.map((p, i) => [p, stockData[i].toString()]),
      ];
    } else {
      // topProducts
      rows = [
        ["Product", ...products],
        ["Units Sold", ...unitsSold.map(String)],
      ];
    }

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
          <option value="topProducts">Top Products</option>
        </select>
        <button onClick={exportPDF} className={styles.button}>
          Export as PDF
        </button>
        <button onClick={exportCSV} className={styles.button}>
          Export as CSV
        </button>
      </div>

      <div ref={chartRef} className={styles.chartWrapper}>
        {chartKey === "salesTrends" && (
          <SalesTrendsChart months={months} data={salesData} />
        )}
        {chartKey === "inventoryStatus" && (
          <InventoryStatusChart products={products} data={stockData} />
        )}
        {chartKey === "topProducts" && (
          <TopProductsPieChart products={products} data={unitsSold} />
        )}
      </div>
    </div>
  );
};

export default ChartSelector;
