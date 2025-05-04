import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";

function Header() {
  const { query, setQuery } = useSearch();
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    async function loadTags() {
      try {
        const [mainRes, minorRes] = await Promise.all([
          axios.get(`${baseURL}/main-categories`),
          axios.get(`${baseURL}/minor-categories`),
        ]);
        const mainList: string[] = mainRes.data;
        const minorList: string[] = minorRes.data;
        setAllTags([...mainList, ...minorList]);
      } catch (err) {
        console.error("Failed to fetch tag lists", err);
      }
    }
    loadTags();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      setFiltered(allTags.filter((tag) => tag.toLowerCase().includes(q)));
    } else {
      setFiltered([]);
    }
  }, [query, allTags]);

  const handleSelect = (tag: string) => {
    setQuery(tag);
    setFiltered([]);
  };

  return (
    <header className={styles.searchHeader} role="search">
      <form
        className={styles.searchForm}
        onSubmit={(e) => e.preventDefault()}
        aria-label="Search form"
      >
        <input
          id="search"
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        <button type="button">New</button>
        <button type="button">Price ascending</button>
        <button type="button">Price descending</button>
      </nav>
    </header>
  );
}

export default Header;

/*import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";


function Header() {
  const { query, setQuery } = useSearch();
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  // 1) On mount, fetch both lists and merge them
  useEffect(() => {
    async function loadTags() {
      try {
        const [mainRes, minorRes] = await Promise.all([
          fetch("/main-categories"),
          fetch("/minor-categories"),
        ]);
        if (!mainRes.ok || !minorRes.ok) {
          throw new Error("Network response was not ok");
        }
        const mainList: string[] = await mainRes.json();
        const minorList: string[] = await minorRes.json();
        setAllTags([...mainList, ...minorList]);
      } catch (err) {
        console.error("Failed to fetch tag lists", err);
      }
    }
    loadTags();
  }, []);

  // 2) Whenever the query or tag list changes, recompute the suggestions
  useEffect(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      setFiltered(allTags.filter((tag) => tag.toLowerCase().includes(q)));
    } else {
      setFiltered([]);
    }
  }, [query, allTags]);

  // 3) Picking a suggestion “commits” it into the shared search term
  const handleSelect = (tag: string) => {
    setQuery(tag);
    setFiltered([]);
  };

  return (
    <header className={styles.searchHeader} role="search">
      <form
        className={styles.searchForm}
        onSubmit={(e) => e.preventDefault()}
        aria-label="Search form"
      >
        <input
          id="search"
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        <button type="button">New</button>
        <button type="button">Price ascending</button>
        <button type="button">Price descending</button>
      </nav>
    </header>
  );
}

export default Header;*/

/*import * as React from "react";
import styles from "./Header.module.css";
import { mainCategories, minorCategories } from "./Category";
import { useSearch } from "./SearchContext";

function Header() {
  const { query, setQuery } = useSearch();
  const [filtered, setFiltered] = React.useState<string[]>([]);

  // Create a combined tag list
  const allTags = React.useMemo(
    () => [...mainCategories, ...minorCategories],
    []
  );

  React.useEffect(() => {
    if (query.trim()) {
      setFiltered(
        allTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
    } else {
      setFiltered([]);
    }
  }, [query, allTags]);

  const handleSelect = (tag: string) => {
    setQuery(tag);
    setFiltered([]);
  };

  return (
    <header className={styles.searchHeader} role="search">
      <form
        className={styles.searchForm}
        onSubmit={(e) => e.preventDefault()}
        aria-label="Search form"
      >
        <input
          id="search"
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        <button type="button">New</button>
        <button type="button">Price ascending</button>
        <button type="button">Price descending</button>
      </nav>
    </header>
  );
}

export default Header;*/

/*import * as React from "react";
import styles from "./Header.module.css";

const allTags = [
  "Digital Art",
  "Pencil Drawing",
  "Ink Drawing",
  "Mixed Media",
  "Art",
  "Drawing",
  "Painting",
  "Sculpture",
  "Photography",
  "Printmaking",
  "Collage",
];

function Header() {
  const [query, setQuery] = React.useState("");
  const [filtered, setFiltered] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (query.trim()) {
      setFiltered(
        allTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
    } else {
      setFiltered([]);
    }
  }, [query]);

  const handleSelect = (tag: string) => {
    setQuery(tag);
    setFiltered([]);
  };

  return (
    <header className={styles.searchHeader}>
      <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
        {filtered.length > 0 && (
          <ul className={styles.suggestions}>
            {filtered.map((tag) => (
              <li key={tag}>
                <button onClick={() => handleSelect(tag)}>{tag}</button>
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className={styles.sortButtons}>
        <button>New</button>
        <button>Price ascending</button>
        <button>Price descending</button>
      </div>
    </header>
  );
}

export default Header;*/
