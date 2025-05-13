// src/components/AdminDashboard/GraphCard.tsx
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
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

// register only the components we use
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Sales Over Time" },
  },
  scales: {
    x: { title: { display: true, text: "Month" } },
    y: { title: { display: true, text: "Total Sales (R)" } },
  },
};

interface GraphCardProps {
  data: {
    labels: string[];
    datasets: { data: number[]; label: string; backgroundColor?: string }[];
  };
}

const GraphCard = forwardRef<HTMLDivElement, GraphCardProps>(
  ({ data }, ref) => (
    <div ref={ref} style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
      <Line options={options} data={data} />
    </div>
  )
);
GraphCard.displayName = "GraphCard";

export default GraphCard;
