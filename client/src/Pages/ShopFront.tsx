import { useEffect, useState } from "react";
import Header from "../components/ShopFrontComp/Header";
import ProductGrid from "../components/ShopFrontComp/ProductGrid";
import styles from "../components/ShopFrontComp/ShopFront.module.css";

import shopLogo from "../assets/shop-logo.png";
import monaLisa from "../assets/mona-lisa.jpg";

type Product = {
  id: number;
  title: string;
  artist: string;
  price: string;
  category: string;
  image: string;
};

function ShopFront() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const dummyProduct: Product = {
      id: 1,
      title: "Art Name",
      artist: "Artist Name",
      price: "R200",
      category: "Painting",
      image: monaLisa
    };

    // Create multiple copies
    const filled = Array.from({ length: 9 }, (_, i) => ({
      ...dummyProduct,
      id: i + 1
    }));

    setProducts(filled);
  }, []);

  return (
    <main className={styles["shopfront-page"]}>
      <Header logo={shopLogo} />
      <ProductGrid products={products} />
    </main>
  );
}

export default ShopFront;
