// src/components/SearchPageComp1/Header.tsx
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";

export default function Header() {
  const { query, setQuery, sort, setSort } = useSearch();
  const [local, setLocal] = useState(query);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  // keep input in sync
  useEffect(() => {
    setLocal(query);
  }, [query]);

  // load categories for suggestions
  useEffect(() => {
    async function loadTags() {
      try {
        const [m, n] = await Promise.all([
          axios.get<string[]>(`${baseURL}/main-categories`),
          axios.get<string[]>(`${baseURL}/minor-categories`),
        ]);
        setAllTags([...m.data, ...n.data]);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadTags();
  }, []);

  // autocomplete filter
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocal(v);
    if (v.trim()) {
      const lv = v.toLowerCase();
      setFiltered(allTags.filter((tag) => tag.toLowerCase().includes(lv)));
    } else {
      setFiltered([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(local.trim());
    setFiltered([]);
  };

  const handleSelect = (tag: string) => {
    setQuery(tag);
    setFiltered([]);
  };

  return (
    <header className={styles.searchHeader} role="search">
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, category or artisan…"
          value={local}
          onChange={handleInput}
        />
        <button type="submit">Search</button>
        {filtered.length > 0 && (
          <ul className={styles.suggestions} role="listbox">
            {filtered.map((tag) => (
              <li key={tag} role="option">
                <button type="button" onClick={() => handleSelect(tag)}>
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      <nav className={styles.sortButtons} aria-label="Sort options">
        <button
          type="button"
          className={sort === "new" ? styles.active : ""}
          onClick={() => setSort("new")}
        >
          New
        </button>
        <button
          type="button"
          className={sort === "priceAsc" ? styles.active : ""}
          onClick={() => setSort("priceAsc")}
        >
          Price ↑
        </button>
        <button
          type="button"
          className={sort === "priceDesc" ? styles.active : ""}
          onClick={() => setSort("priceDesc")}
        >
          Price ↓
        </button>
      </nav>
    </header>
  );
}
