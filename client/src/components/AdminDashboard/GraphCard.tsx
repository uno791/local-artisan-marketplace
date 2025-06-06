import React, { forwardRef } from "react";
import {
  Chart as ChartJS,
  registerables,
  ChartOptions,
  type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

// chart registration
if (typeof ChartJS.register === "function") {
  ChartJS.register(...registerables);
} else {
  // @ts-ignore
  ChartJS.register = (..._args: any[]) => {};
}

// chart options
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

// props interface
interface GraphCardProps {
  data: ChartData<"line", number[], string>;
}

// component definition
const GraphCard = forwardRef<HTMLDivElement, GraphCardProps>(
  ({ data }, ref) => (
    <div ref={ref} style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
      <Line options={options} data={data} />
    </div>
  )
);
GraphCard.displayName = "GraphCard";

export default GraphCard;
