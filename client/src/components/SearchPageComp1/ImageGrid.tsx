import React, { useEffect, useState } from "react";
import styles from "./ImageGrid.module.css";
import { useSearch } from "./SearchContext";
import axios from "axios";
import { baseURL } from "../../config";
import ProductCard, { Product } from "./ProductCard";

interface Props {
  setLoading: (value: boolean) => void;
}

export default function ImageGrid({ setLoading }: Props) {
  const { query, sort } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const base = query ? "/products/search" : "/allproducts";
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        params.set("sort", sort);
        const url = `${baseURL}${base}?${params.toString()}`;

        const res = await axios.get<Product[]>(url);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, sort, setLoading]);

  return (
    <section className={styles.imageGrid} aria-label="Product results">
      {products.map((p) => (
        <ProductCard key={p.product_id} product={p} />
      ))}
    </section>
  );
}
