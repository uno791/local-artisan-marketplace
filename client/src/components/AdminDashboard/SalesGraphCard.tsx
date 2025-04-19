"use client";

import React from "react";
import styles from "./SalesGraphCard.module.css";

export const SalesGraphCard: React.FC = () => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Sales Graph</h2>
      <div className={styles.graph} />
    </section>
  );
};
