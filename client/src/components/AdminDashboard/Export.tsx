import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { chartData } from "./GraphCard";

interface ExportProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
}
const Export: React.FC<ExportProps> = ({ chartRef }) => {
  const labels = chartData.labels as string[];
  const values = chartData.datasets[0].data as number[];

  const exportCSV = () => {
    const header = "label,value\n";
    const rows = labels.map((l, i) => `${l},${values[i]}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
      <button onClick={exportCSV}>Export CSV</button>
      <button onClick={exportPDF}>Export as PDF</button>
    </div>
  );
};

export default Export;
