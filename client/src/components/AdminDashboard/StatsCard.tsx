import React from "react";
import styles from "./StatsCard.module.css";

// props interface
interface StatsCardProps {
  label: string;
  value: string;
}

// component definition
const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
    </article>
  );
};

export default StatsCard;
