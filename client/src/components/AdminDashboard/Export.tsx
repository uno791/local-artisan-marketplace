import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { ChartData } from "chart.js";

// props include chart reference and its data
interface ExportProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  data: ChartData<"line", number[], string>;
}

const Export: React.FC<ExportProps> = ({ chartRef, data }) => {
  const labels = data.labels as string[];
  const values = data.datasets[0].data as number[];

  // creates and downloads a csv file
  const exportCSV = () => {
    const header = "month,total\n";
    const rows = labels.map((m, i) => `${m},${values[i]}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // captures chart as image and exports it to pdf
  const exportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("sales-chart.pdf");
  };

  return (
    // export buttons container
    <nav style={{ marginTop: 16, display: "flex", gap: 10 }}>
      <button onClick={exportCSV}>Export CSV</button>
      <button onClick={exportPDF}>Export as PDF</button>
    </nav>
  );
};

export default Export;
