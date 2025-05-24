import React from "react";
import styles from "./StatsChart.module.css";

// list of months for x-axis labels
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// sample data for each month
const data = [50, 80, 120, 150, 100, 200, 140, 180, 160, 300, 340, 400];

const StatsChart: React.FC = () => {
  return (
    <section className={styles.chartContainer}>
      {/* chart header */}
      <header className={styles.chartHeader}>
        <h4>activity</h4>
        <span>month ▾</span>
      </header>

      {/* simple bar chart using div height */}
      <figure className={styles.barChart}>
        {data.map((value, index) => (
          <article key={index} className={styles.barItem}>
            <span
              className={styles.bar}
              style={{ display: "block", height: `${value}px` }}
            />
            <figcaption className={styles.label}>{months[index]}</figcaption>
          </article>
        ))}
      </figure>
    </section>
  );
};

export default StatsChart;
