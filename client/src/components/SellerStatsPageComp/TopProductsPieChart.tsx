import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import styles from "./TopProductsPieChart.module.css";

// register chart.js components used in pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  products: string[];
  data: number[];
}

const TopProductsPieChart: React.FC<Props> = ({ products, data }) => {
  // setup chart data with product names and units sold
  const chartData: ChartData<"pie", number[], string> = {
    labels: products,
    datasets: [
      {
        label: "units sold",
        data,
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(255,205,86,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(153,102,255,0.6)",
        ],
      },
    ],
  };

  // pie chart config
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "top 5 products by units sold",
      },
    },
  };

  return (
    <section className={styles.chartInner}>
      <Pie data={chartData} options={options} />
    </section>
  );
};

export default TopProductsPieChart;
