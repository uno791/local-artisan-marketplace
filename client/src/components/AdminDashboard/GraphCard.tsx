import React from "react";
import styles from "./GraphCard.module.css";

const GraphCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Sales Overview</h3>
      <div className={styles.graph}>[Graph Placeholder]</div>
    </div>
  );
};

export default GraphCard;
