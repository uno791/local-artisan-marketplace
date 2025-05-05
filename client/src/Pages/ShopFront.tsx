import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/ShopFrontComp/Header";
import ProductGrid from "../components/ShopFrontComp/ProductGrid";
import ReportShop from "../components/ShopFrontComp/ReportShop";
import styles from "../components/ShopFrontComp/ShopFront.module.css";

import { baseURL } from "../config";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image_url: string;
  username: string;
}

interface Artisan {
  shop_name: string;
  shop_pfp: string;
  bio: string;
  shop_address: string;
}

function ShopFront() {
  const { username } = useParams();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);

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
      <section className={styles["report-shop-container"]}>
        <button
          onClick={() => setShowReportModal(true)}
          className={styles["report-btn"]}
        >
          Report Shop
        </button>
      </section>

      <Header
        logo={artisan?.shop_pfp}
        name={artisan?.shop_name || "Artisan Shop"}
        bio={artisan?.bio}
      />

      <ProductGrid
        products={products.map((p) => ({
          id: p.product_id,
          title: p.product_name,
          artist: artisan?.shop_name || "Unknown",
          price: `R${p.price}`,
          category: "Custom",
          image: p.image_url,
        }))}
      />

      {showReportModal && (
        <ReportShop onClose={() => setShowReportModal(false)} />
      )}
    </main>
  );
}

export default ShopFront;
