import React from "react";
import styles from "./FilterBar.module.css";

const categories = ["All"];

type Props = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
};

function FilterBar({ selectedCategory, onSelectCategory }: Props) {
  return (
    <div className={styles.filterBar}>
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
    </div>
  );
}

export default FilterBar;
