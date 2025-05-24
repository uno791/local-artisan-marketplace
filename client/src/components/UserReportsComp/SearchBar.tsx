import React from "react";
import styles from "./SearchBar.module.css";

interface Props {
  value: string; // current input value
  onChange: (val: string) => void; // callback for when input changes
}

// renders a styled input field with search placeholder
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
    </section>
  );
};

export default ReportSearchBar;
