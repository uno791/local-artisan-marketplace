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

interface Artisan {
  shop_pfp: string;
  shop_name: string;
  shop_address: string;
  bio: string;
}

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useUser(); // get the currently logged-in user

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
            username={product.username}
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
