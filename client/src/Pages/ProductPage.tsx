// import necessary modules and components
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

// product type definition
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

// artisan/shop type definition
interface Artisan {
  shop_pfp: string;
  shop_name: string;
  shop_address: string;
  bio: string;
}

// main product page component
function ProductPage() {
  // get product id from url
  const { id } = useParams<{ id: string }>();

  // state for product and artisan data
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);

  // modal state for reporting
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useUser(); // currently logged-in user

  // fetch product and artisan details on load
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

  // show loading text while product is loading
  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <main className={styles["product-page"]}>
      {/* report product button */}
      <section className={styles["report-button-container"]}>
        <button
          onClick={() => setShowReportModal(true)}
          className={styles["report-btn"]}
        >
          Report Product
        </button>
      </section>

      {/* back navigation */}
      <BackButton />

      {/* main product layout */}
      <section className={styles["product-main"]}>
        {/* product image */}
        <section className={styles["product-left"]}>
          <ProductImage image_url={product.image_url} />
        </section>

        {/* product info center column */}
        <section className={styles["product-middle"]}>
          <ProductInfo
            name={product.product_name}
            description={product.description}
            price={product.price}
            details={product.details}
            product={product}
          />
        </section>

        {/* seller and tags sidebar */}
        <aside className={styles["product-right"]}>
          <SidebarInfo
            username={product.username}
            shop_pfp={artisan?.shop_pfp || ""}
            shop_name={artisan?.shop_name || ""}
            mainCategory={product.category_name}
            minorTags={product.tags}
          />
        </aside>
      </section>

      {/* report modal */}
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
