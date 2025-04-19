"use client";

import React from "react";
import styles from "./StatisticsCard.module.css";

interface StatisticsCardProps {
  value: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ value }) => {
  return <article className={styles.card}>{value}</article>;
};
