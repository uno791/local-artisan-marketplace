// src/components/AdminDashboard/GraphCard.tsx
import React, { forwardRef } from "react";
import { Chart as ChartJS, registerables, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
if (typeof ChartJS.register === "function") {
  ChartJS.register(...registerables);
} else {
  // @ts-ignore
  ChartJS.register = (..._args: any[]) => {};
}

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
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
