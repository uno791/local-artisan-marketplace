import React from "react";
import styles from "./StatsChart.module.css";

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

const data = [50, 80, 120, 150, 100, 200, 140, 180, 160, 300, 340, 400];

const StatsChart: React.FC = () => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h4>Activity</h4>
        <span>Month ▾</span>
      </div>
      <div className={styles.barChart}>
        {data.map((value, index) => (
          <div key={index} className={styles.barItem}>
            <div className={styles.bar} style={{ height: `${value}px` }} />
            <span className={styles.label}>{months[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsChart;
