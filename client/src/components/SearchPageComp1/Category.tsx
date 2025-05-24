import React, { useState, useEffect } from "react";
import styles from "./Category.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";

function Category() {
  const { setQuery } = useSearch();
  const [mainCats, setMainCats] = useState<string[]>([]);
  const [minorCats, setMinorCats] = useState<string[]>([]); // Still loaded

  useEffect(() => {
    async function load() {
      try {
        const [mainRes, minorRes] = await Promise.all([
          axios.get(`${baseURL}/main-categories`),
          axios.get(`${baseURL}/minor-categories`),
        ]);
        setMainCats(mainRes.data);
        setMinorCats(minorRes.data); // Still fetched but not displayed
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

/*import React, { useState, useEffect } from "react";
import styles from "./Category.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";

function Category() {
  const { setQuery } = useSearch();
  const [mainCats, setMainCats] = useState<string[]>([]);
  const [minorCats, setMinorCats] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [mainRes, minorRes] = await Promise.all([
          fetch("/main-categories"),
          fetch("/minor-categories"),
        ]);
        if (!mainRes.ok || !minorRes.ok) {
          throw new Error("Network response was not ok");
        }
        setMainCats(await mainRes.json());
        setMinorCats(await minorRes.json());
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    load();
  }, []);

  return (
    <nav className={styles.sidebar} aria-label="Category filters">
      <h2>Main categories</h2>
      <ul>
        {mainCats.map((tag) => (
          <li key={tag}>
            <button onClick={() => setQuery(tag)}>{tag}</button>
          </li>
        ))}
      </ul>

      <h2>Minor categories</h2>
      <ul>
        {minorCats.map((tag) => (
          <li key={tag}>
            <button onClick={() => setQuery(tag)}>{tag}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Category;*/

/*import * as React from "react";
import styles from "./Category.module.css";
import { useSearch } from "./SearchContext";

export const mainCategories = [
  "Painting",
  "Photography",
  "Art",
  "Sculpture",
  "Digital Art",
  "Street Art",
  "Contemporary",
  "Abstract",
  "Realism",
  "Impressionism",
  "Pop Art",
  "Minimalism",
];

export const minorCategories = [
  "Charcoal painting",
  "Pixel art",
  "Pastel painting",
  "Watercolor",
  "Oil Painting",
  "Acrylic",
  "Pencil Drawing",
];

function Category() {
  const { setQuery } = useSearch();

  return (
    <nav className={styles.sidebar} aria-label="Category filters">
      <h2>Main categories</h2>
      <ul>
        {mainCategories.map((tag) => (
          <li key={tag}>
            <button onClick={() => setQuery(tag)}>{tag}</button>
          </li>
        ))}
      </ul>

      <h2>Minor categories</h2>
      <ul>
        {minorCategories.map((tag) => (
          <li key={tag}>
            <button onClick={() => setQuery(tag)}>{tag}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Category;*/

/*import * as React from "react";
import styles from "./Category.module.css";

const mainCategories = [
  "Painting",
  "Photography",
  "Art",
  "Sculpture",
  "Digital Art",
  "Street Art",
  "Contemporary",
  "Abstract",
  "Realism",
  "Impressionism",
  "Pop Art",
  "Minimalism",
];

const minorCategories = [
  "Charcoal painting",
  "Pixel art",
  "Pastel painting",
  "Watercolor",
  "Oil Painting",
  "Acrylic",
  "Pencil Drawing",
];

function Category() {
  const handleClick = (tag: string) => {
    // In future: insert into search bar context
    console.log("Tag clicked:", tag);
  };

  return (
    <nav className={styles.sidebar} aria-label="Category filters">
      <h2>Main categories</h2>
      <ul>
        {mainCategories.map((tag) => (
          <li key={tag}>
            <button onClick={() => handleClick(tag)}>{tag}</button>
          </li>
        ))}
      </ul>
      <h2>Minor categories</h2>
      <ul>
        {minorCategories.map((tag) => (
          <li key={tag}>
            <button onClick={() => handleClick(tag)}>{tag}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Category;*/
