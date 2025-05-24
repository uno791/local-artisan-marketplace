import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./InventoryStatusChart.module.css";

// register chart.js components needed for bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  products: string[]; // product labels
  data: number[]; // units in stock
}

// chart config options
const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    x: { title: { display: true, text: "Product" } },
    y: { title: { display: true, text: "Units in Stock" } },
  },
};

// main chart component
const InventoryStatusChart: React.FC<Props> = ({ products, data }) => {
  const chartData: ChartData<"bar", number[], string> = {
    labels: products,
    datasets: [
      {
        label: "Products",
        data,
        backgroundColor: "rgba(42, 19, 144, 0.5)", // semi-transparent purple
      },
    ],
  };

  return (
    <section className={styles.chartInner}>
      <Bar options={options} data={chartData} />
    </section>
  );
};

export default InventoryStatusChart;
