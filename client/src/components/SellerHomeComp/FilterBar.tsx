import React from "react";
import styles from "./FilterBar.module.css";

// expected props for filter bar
type Props = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
};

// displays horizontal list of category buttons
function FilterBar({ selectedCategory, onSelectCategory, categories }: Props) {
  return (
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
