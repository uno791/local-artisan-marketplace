import React from "react";
import styles from "./SearchBar.module.css";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const ReportSearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <section className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search reports..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className={styles.filterButton}>All Status</button>
    </section>
  );
};

export default ReportSearchBar;