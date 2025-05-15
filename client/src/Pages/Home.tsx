import styles from "../components/HomePageComp/Home.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";
import { Logo } from "../components/HomePageComp/Localish-ProductImage";
// BO: Import user context
import { useUser } from "../Users/UserContext";

interface Product {
  username: string;
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  image_url: string;
}

function Home() {
  const [gridProducts, setProducts] = useState<Product[]>([]);

  // BO: Access username from context
  const { user } = useUser();

  // BO: Fetch recommended products when username is ready
  useEffect(() => {
    if (!user?.username) return;

    axios
      .get(`${baseURL}/homepage-recommendations`, {
        params: { username: user.username },
      })
      .then((res) => {
        console.log("🔍 Recommended products = ", res.data);
        setProducts(res.data);
      })
      .catch((err) =>
        console.error("❌ Error loading recommended products:", err)
      );
  }, [user?.username]);

  // BO: Track product click
  const handleProductClick = async (productId: number) => {
    if (!user?.username) return;
    try {
      await axios.post(`${baseURL}/track-click`, {
        username: user.username,
        productId,
      });
    } catch (err) {
      console.error("BO: Failed to track click:", err);
    }
  };

  return (
    <main className={styles.home}>
      <section className={styles.allProducts}>
        <h2>For you</h2>
        <ul className={styles.allProductsGrid}>
          {gridProducts.map((product, index) => (
            <li key={index} className={styles.productCard}>
              <Link
                to={`/Product/${product.product_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => handleProductClick(product.product_id)} // BO: Track clicks
              >
                <article>
                  <figure>
                    <img src={product.image_url} alt="Product" />

                    <figcaption>
                      <p className={styles.title}>{product.product_name}</p>
                      <p className={styles.artist}>{product.username}</p>
                      <p className={styles.price}>{`R${product.price}`}</p>
                    </figcaption>
                  </figure>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Home;
