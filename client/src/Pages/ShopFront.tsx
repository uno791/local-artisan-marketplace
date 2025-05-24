// import hooks and required modules
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/ShopFrontComp/Header";
import ProductGrid from "../components/ShopFrontComp/ProductGrid";
// removed ReportShop import
import styles from "../components/ShopFrontComp/ShopFront.module.css";

import { baseURL } from "../config";

// product type definition
interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image_url: string;
  username: string;
  category?: string;
}

// artisan/shop owner type definition
interface Artisan {
  shop_name: string;
  shop_pfp: string;
  bio: string;
  shop_address: string;
  shop_banner: string;
}

// helper function to format base64 image source
function getImageSrc(base64: string | undefined): string {
  if (!base64 || base64.trim() === "") return "";
  if (base64.startsWith("data:")) return base64;
  return `data:image/jpeg;base64,${base64}`;
}

// main shop front component
function ShopFront() {
  const { username } = useParams();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  // removed showReportModal state

  // fetch artisan and products when username is available
  useEffect(() => {
    axios
      .get(`${baseURL}/artisan/${username}`)
      .then((res) => setArtisan(res.data))
      .catch((err) => console.error("❌ Failed to fetch artisan:", err));

    axios
      .get(`${baseURL}/allproducts`)
      .then((res) => {
        // filter only products by this artisan
        const artisanProducts = res.data.filter(
          (p: Product) => p.username === username
        );
        setProducts(artisanProducts);
      })
      .catch((err) => console.error("❌ Failed to fetch products:", err));
  }, [username]);

  return (
    <main className={styles["shopfront-page"]}>
      {/* shop header with banner and profile */}
      <Header
        logo={getImageSrc(artisan?.shop_pfp)}
        name={artisan?.shop_name || "Artisan Shop"}
        bio={artisan?.bio}
        banner={getImageSrc(artisan?.shop_banner)}
        // removed onReportClick prop
      />

      {/* grid of artisan's products */}
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

      {/* removed ReportShop modal rendering */}
    </main>
  );
}

export default ShopFront;
