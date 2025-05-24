import React from "react";
import styles from "./FilterBar.module.css";

// props include current selection, setter, and list of categories
type Props = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
};

function FilterBar({ selectedCategory, onSelectCategory, categories }: Props) {
  return (
    // nav used to group category filter buttons
    <nav className={styles.filterBar}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`${styles.filterButton} ${
            selectedCategory === cat ? styles.active : ""
          }`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}

export default FilterBar;
