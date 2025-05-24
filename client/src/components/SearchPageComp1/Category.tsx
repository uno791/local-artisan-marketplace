import React, { useState, useEffect } from "react";
import styles from "./Category.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";

function Category() {
  const { setQuery } = useSearch();

  // main and minor categories from api
  const [mainCats, setMainCats] = useState<string[]>([]);
  const [minorCats, setMinorCats] = useState<string[]>([]); // still loaded but unused

  // fetch categories on component mount
  useEffect(() => {
    async function load() {
      try {
        const [mainRes, minorRes] = await Promise.all([
          axios.get(`${baseURL}/main-categories`),
          axios.get(`${baseURL}/minor-categories`),
        ]);
        setMainCats(mainRes.data);
        setMinorCats(minorRes.data); // fetched but not shown
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }

    load();
  }, []);

  return (
    // sidebar with category filter buttons
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
