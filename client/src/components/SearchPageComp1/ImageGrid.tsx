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
  const [productsWithShops, setProductsWithShops] = useState<
    Array<Product & { shopName: string }>
  >([]);

  useEffect(() => {
    const fetchEverything = async () => {
      setLoading(true);
      try {
        const base = query ? "/products/search" : "/allproducts";
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        params.set("sort", sort);
        const url = `${baseURL}${base}?${params.toString()}`;

        // 1. Fetch products
        const res = await axios.get<Product[]>(url);
        const products = res.data;

        // 2. Fetch shop names
        const usernames = [...new Set(products.map((p) => p.username))];
        const shopMap: Record<string, string> = {};

        await Promise.all(
          usernames.map(async (uname) => {
            try {
              const art = await axios.get(`${baseURL}/artisan/${uname}`);
              shopMap[uname] = art.data.shop_name || uname;
            } catch {
              shopMap[uname] = uname;
            }
          })
        );

        // 3. Combine product + shop name BEFORE rendering
        const combined = products.map((p) => ({
          ...p,
          shopName: shopMap[p.username],
        }));

        setProductsWithShops(combined);
      } catch (err) {
        console.error("❌ Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, [query, sort, setLoading]);

  return (
    <section className={styles.imageGrid} aria-label="Product results">
      {productsWithShops.map((p) => (
        <ProductCard key={p.product_id} product={p} shopName={p.shopName} />
      ))}
    </section>
  );
}
