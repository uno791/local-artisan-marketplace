import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/ShopFrontComp/Header";
import ProductGrid from "../components/ShopFrontComp/ProductGrid";
// Removed ReportShop import
import styles from "../components/ShopFrontComp/ShopFront.module.css";

import { baseURL } from "../config";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image_url: string;
  username: string;
  category?: string;
}

interface Artisan {
  shop_name: string;
  shop_pfp: string;
  bio: string;
  shop_address: string;
  shop_banner: string;
}

function getImageSrc(base64: string | undefined): string {
  if (!base64 || base64.trim() === "") return "";
  if (base64.startsWith("data:")) return base64;
  return `data:image/jpeg;base64,${base64}`;
}

function ShopFront() {
  const { username } = useParams();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  // Removed showReportModal state

  useEffect(() => {
    axios
      .get(`${baseURL}/artisan/${username}`)
      .then((res) => setArtisan(res.data))
      .catch((err) => console.error("❌ Failed to fetch artisan:", err));

    axios
      .get(`${baseURL}/allproducts`)
      .then((res) => {
        const artisanProducts = res.data.filter(
          (p: Product) => p.username === username
        );
        setProducts(artisanProducts);
      })
      .catch((err) => console.error("❌ Failed to fetch products:", err));
  }, [username]);

  return (
    <main className={styles["shopfront-page"]}>
      <Header
        logo={getImageSrc(artisan?.shop_pfp)}
        name={artisan?.shop_name || "Artisan Shop"}
        bio={artisan?.bio}
        banner={getImageSrc(artisan?.shop_banner)}
        // Removed onReportClick prop
      />

      <ProductGrid
        products={products.map((p) => ({
          id: p.product_id,
          title: p.product_name,
          artist: artisan?.shop_name || "Unknown",
          price: `R${p.price}`,
          image: getImageSrc(p.image_url),
          category: p.category || "",
        }))}
      />

      {/* Removed ReportShop modal rendering */}
    </main>
  );
}

export default ShopFront;
