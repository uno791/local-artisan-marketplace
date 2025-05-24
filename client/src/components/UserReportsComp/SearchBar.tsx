import React from "react";
import styles from "./SearchBar.module.css";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const ReportSearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    // container for search input
    <section className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search reports..."
        value={value}
        // call onChange callback on input update
        onChange={(e) => onChange(e.target.value)}
      />
    </section>
  );
};

export default ReportSearchBar;
