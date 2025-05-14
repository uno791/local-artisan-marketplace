import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./SalesTrendsChart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  months: string[]; // e.g. ["Jan","Feb",…]
  data: number[]; // e.g. [1200, 800, …]
}

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    x: { title: { display: true, text: "Month" } },
    y: { title: { display: true, text: "Revenue (R)" } },
  },
};

const SalesTrendsChart: React.FC<Props> = ({ months, data }) => {
  const chartData: ChartData<"line", number[], string> = {
    labels: months,
    datasets: [
      {
        label: "Sales",
        data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className={styles.chartInner}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default SalesTrendsChart;
