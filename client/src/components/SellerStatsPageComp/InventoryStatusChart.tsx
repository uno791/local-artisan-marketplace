import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  products: string[];
  data: number[];
}

const InventoryStatusChart: React.FC<Props> = ({ products, data }) => {
  const chartData = {
    labels: products,
    datasets: [
      {
        label: "Stock",
        data,
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
        text: "Inventory Status",
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default InventoryStatusChart;
