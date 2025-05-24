import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  products: string[];
  data: number[];
}

const TopProductsPieChart: React.FC<Props> = ({ products, data }) => {
  const chartData = {
    labels: products,
    datasets: [
      {
        label: "Units Sold",
        data,
        backgroundColor: [
          "#f87171",
          "#fbbf24",
          "#34d399",
          "#60a5fa",
          "#a78bfa",
        ],
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
        text: "Top Selling Products",
      },
    },
  };

  return <Pie options={options} data={chartData} />;
};

export default TopProductsPieChart;
