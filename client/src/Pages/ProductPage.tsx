import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import styles from "../components/ProductPageComp/ProductPage.module.css";
import BackButton from "../components/ProductPageComp/BackButton";
import ProductImage from "../components/ProductPageComp/ProductImage";
import ProductInfo from "../components/ProductPageComp/ProductInfo";
import SidebarInfo from "../components/ProductPageComp/SideBarInfo";
import ReportProduct from "../components/ProductPageComp/ReportProduct";
import { baseURL } from "../config";

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  username: string;
  details: string;
}

interface Artisan {
  shop_pfp: string;
  shop_name: string;
  shop_address: string;
  bio: string;
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
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
    return <p>Loading product...</p>;
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

          <Link to={`/shop/${product.username}`}>
            {artisan?.shop_pfp && (
              <img
                src={artisan.shop_pfp}
                alt={`${artisan.shop_name} Logo`}
                style={{
                  width: "140px",
                  height: "140px",
                  marginTop: "1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
              />
            )}
          </Link>
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
          <SidebarInfo username={product.username} />
        </aside>
      </section>

      {showReportModal && (
        <ReportProduct onClose={() => setShowReportModal(false)} />
      )}
    </main>
  );
}

export default ProductPage;

/*import "./ProductPage.css";
import BackButton from "../components/BackButton";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import SidebarInfo from "../components/SideBarInfo";

function ProductPage() {
  return (
    <main className="product-page">
      <BackButton />

      <section className="product-main">
        <section className="product-left">
          <ProductImage />
        </section>

        <section className="product-middle">
          <ProductInfo />
        </section>

        <aside className="product-right">
          <SidebarInfo />
        </aside>
      </section>
    </main>
  );
}

export default ProductPage;*/
