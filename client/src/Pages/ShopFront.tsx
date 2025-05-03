import { useEffect, useState } from "react";
import Header from "../components/ShopFrontComp/Header";
import ProductGrid from "../components/ShopFrontComp/ProductGrid";
import ReportShop from "../components/ShopFrontComp/ReportShop";

import styles from "../components/ShopFrontComp/ShopFront.module.css";

//import shopLogo from "../assets/shop-logo.png";
import shopLogo from "../assets/profile.png";
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
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const dummyProduct: Product = {
      id: 1,
      title: "Art Name",
      artist: "Artist Name",
      price: "R200",
      category: "Painting",
      image: monaLisa,
    };

    const filled = Array.from({ length: 9 }, (_, i) => ({
      ...dummyProduct,
      id: i + 1,
    }));

    setProducts(filled);
  }, []);

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

      <Header logo={shopLogo} />

      <ProductGrid products={products} />

      {showReportModal && (
        <ReportShop onClose={() => setShowReportModal(false)} />
      )}
    </main>
  );
}

export default ShopFront;
