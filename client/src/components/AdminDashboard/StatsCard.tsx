import React from "react";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  label: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
    </div>
  );
};

export default StatsCard;
