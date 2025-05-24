import React from "react";
import styles from "./StatsCard.module.css";

// props include a label and a value to display
interface StatsCardProps {
  label: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    // card showing a stat label and value
    <article className={styles.card}>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
    </article>
  );
};

export default StatsCard;
