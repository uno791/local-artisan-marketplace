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

const options = {
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
  data: ChartData<"line", number[], string>;
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
