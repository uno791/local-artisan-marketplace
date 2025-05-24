import React, { useEffect, useState } from "react";
import styles from "../EditProductPageComp/TypeOfArtSelector.module.css";
import { baseURL } from "../../config";


interface Props {
  TypeOfArt: string;
  setTypeOfArt: (type: string) => void;
}

const TypeOfArtSelector: React.FC<Props> = ({ TypeOfArt, setTypeOfArt }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseURL}/main-categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load main categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className={styles.container}>
      <label htmlFor="typeOfArt">
        <strong>Type of Art:</strong>
      </label>
      <select
        id="typeOfArt"
        className={styles.select}
        value={TypeOfArt}
        onChange={(e) => setTypeOfArt(e.target.value)}
      >
        <option value="" disabled hidden>
          None Selected
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </section>
  );
};

export default TypeOfArtSelector;