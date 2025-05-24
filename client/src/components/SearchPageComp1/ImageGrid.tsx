import React, { useEffect, useState } from "react";
import styles from "./ImageGrid.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";
import ProductCard, { Product } from "./ProductCard";

// image grid for rendering search results
export default function ImageGrid() {
  const { query, sort } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);

  // fetch products when query or sort changes
  useEffect(() => {
    const base = query ? "/products/search" : "/allproducts";
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    params.set("sort", sort);
    const url = `${baseURL}${base}?${params.toString()}`;

    axios
      .get<Product[]>(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [query, sort]);

  return (
    <section className={styles.imageGrid} aria-label="Product results">
      {products.map((p) => (
        <ProductCard key={p.product_id} product={p} />
      ))}
    </section>
  );
}
