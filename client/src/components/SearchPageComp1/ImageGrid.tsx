// src/components/SearchPageComp1/ImageGrid.tsx
import React, { useEffect, useState } from "react";
import styles from "./ImageGrid.module.css"; // grid layout :contentReference[oaicite:16]{index=16}:contentReference[oaicite:17]{index=17}
import { useSearch } from "./SearchContext"; // context :contentReference[oaicite:18]{index=18}:contentReference[oaicite:19]{index=19}
import axios from "axios";
import { baseURL } from "../../config";
import ProductCard, { Product } from "./ProductCard";

export default function ImageGrid() {
  const { query } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const url = query
      ? `${baseURL}/products/search?query=${encodeURIComponent(query)}`
      : `${baseURL}/allproducts`;
    axios
      .get<Product[]>(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [query]);

  return (
    <section className={styles.imageGrid} aria-label="Product results">
      {products.map((p) => (
        <ProductCard key={p.product_id} product={p} />
      ))}
    </section>
  );
}
