import styles from "../components/HomePageComp/Home.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";
import { Logo } from "../components/HomePageComp/Localish-ProductImage";

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

  useEffect(() => {
    axios
      .get(`${baseURL}/allproducts`)
      .then((res) => {
        console.log("🔍 res.data = ", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("❌ Error loading products:", err));
  }, []);

  return (
    <main className={styles.home}>
      <section className={styles.allProducts}>
        <h2>All Products</h2>
        <ul className={styles.allProductsGrid}>
          {gridProducts.map((product, index) => (
            <li key={index} className={styles.productCard}>
              <Link
                to={`/Product/${product.product_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
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
