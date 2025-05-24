import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
  months: string[];
  data: number[];
}

const SalesTrendsChart: React.FC<Props> = ({ months, data }) => {
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sales Trends",
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default SalesTrendsChart;
