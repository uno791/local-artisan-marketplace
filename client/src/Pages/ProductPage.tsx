import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/ProductPageComp/ProductPage.module.css";

import BackButton from "../components/ProductPageComp/BackButton";
import ProductImage from "../components/ProductPageComp/ProductImage";
import ProductInfo from "../components/ProductPageComp/ProductInfo";
import SidebarInfo from "../components/ProductPageComp/SideBarInfo";
import ReportProduct from "../components/ProductPageComp/ReportProduct";

import { baseURL } from "../config";
import { useUser } from "../Users/UserContext";

// Product type definition
interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  username: string;
  details: string;
  width: number;
  height: number;
  weight: number;
  category_name: string;
  tags: string[];
}

// Artisan/shop type definition
interface Artisan {
  shop_pfp: string;
  shop_name: string;
  shop_address: string;
  bio: string;
}

// Hourglass Loader Component
function HourglassLoader() {
  return (
    <div className={styles.hourglassBackground}>
      <div className={styles.hourglassContainer}>
        <div className={styles.hourglassCurves}></div>
        <div className={styles.hourglassCapTop}></div>
        <div className={styles.hourglassGlassTop}></div>
        <div className={styles.hourglassSand}></div>
        <div className={styles.hourglassSandStream}></div>
        <div className={styles.hourglassCapBottom}></div>
        <div className={styles.hourglassGlass}></div>
      </div>
    </div>
  );
}

// Main Product Page Component
function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${baseURL}/product/${id}`)
      .then((res) => {
        setProduct(res.data);
        return axios.get(`${baseURL}/artisan/${res.data.username}`);
      })
      .then((artisanRes) => {
        setArtisan(artisanRes.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching data:", err);
      });
  }, [id]);

  if (!product) {
    return <HourglassLoader />;
  }

  return (
    <main className={styles["product-page"]}>
      <section className={styles["report-button-container"]}>
        <button
          onClick={() => setShowReportModal(true)}
          className={styles["report-btn"]}
        >
          Report Product
        </button>
      </section>

      <BackButton />

      <section className={styles["product-main"]}>
        <section className={styles["product-left"]}>
          <ProductImage image_url={product.image_url} />
        </section>

        <section className={styles["product-middle"]}>
          <ProductInfo
            name={product.product_name}
            description={product.description}
            price={product.price}
            details={product.details}
            product={product}
          />
        </section>

        <aside className={styles["product-right"]}>
          <SidebarInfo
            username={artisan?.shop_name || ""}
            shop_pfp={artisan?.shop_pfp || ""}
            shop_name={artisan?.shop_name || ""}
            mainCategory={product.category_name}
            minorTags={product.tags}
          />
        </aside>
      </section>

      {showReportModal && user?.username && (
        <ReportProduct
          productId={product.product_id}
          sellerUsername={product.username}
          reporterUsername={user.username}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </main>
  );
}

export default ProductPage;
