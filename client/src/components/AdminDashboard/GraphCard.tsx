import React, { forwardRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// — define and export your labels & dataset *once* —
export const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const chartData: ChartData<"line", number[], string> = {
  labels: chartLabels,
  datasets: [
    {
      label: "Monthly Sales",
      data: [12000, 19000, 3000, 5000, 2000, 30000],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.2,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Sales Over Time" },
  },
};

const GraphCard = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
    <Line options={options} data={chartData} />
  </div>
));
GraphCard.displayName = "GraphCard";

export default GraphCard;
