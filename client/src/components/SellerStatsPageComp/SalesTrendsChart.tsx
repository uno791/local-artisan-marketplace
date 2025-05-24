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

// register required chart.js modules
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
  months: string[]; // x-axis labels like ["jan", "feb", ...]
  data: number[]; // sales values for each month
}

// chart config
const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    x: { title: { display: true, text: "month" } },
    y: { title: { display: true, text: "revenue (r)" } },
  },
};

// line chart component
const SalesTrendsChart: React.FC<Props> = ({ months, data }) => {
  const chartData: ChartData<"line", number[], string> = {
    labels: months,
    datasets: [
      {
        label: "sales",
        data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  return (
    <section className={styles.chartInner}>
      <Line options={options} data={chartData} />
    </section>
  );
};

export default SalesTrendsChart;
