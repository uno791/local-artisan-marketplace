import React from "react";
import styles from "./FilterBar.module.css";

const categories = [
  "All",
  "Painting",
  "Photography",
  "Digital Art",
  "Sculpture",
  "Ssss",
];

type Props = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

function FilterBar({ selectedCategory, onSelectCategory }: Props) {
  return (
    <div className={styles.filterBar}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={
            `${styles.filterButton} ` +
            (selectedCategory === cat ? styles.active : "")
          }
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
