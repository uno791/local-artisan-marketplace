import React, { useState, useEffect } from "react";
import styles from "./Category.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";

// component definition
function Category() {
  const { setQuery } = useSearch();
  const [mainCats, setMainCats] = useState<string[]>([]);
  const [minorCats, setMinorCats] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [mainRes, minorRes] = await Promise.all([
          axios.get(`${baseURL}/main-categories`),
          axios.get(`${baseURL}/minor-categories`),
        ]);
        setMainCats(mainRes.data);
        setMinorCats(minorRes.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    load();
  }, []);

  return (
    <nav className={styles.sidebar} aria-label="Category filters">
      <h2>Categories</h2>
      <ul>
        {mainCats.map((tag) => (
          <li key={tag}>
            <button onClick={() => setQuery(tag)}>{tag}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Category;
