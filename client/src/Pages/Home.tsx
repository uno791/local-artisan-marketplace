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
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselProducts = new Array(10).fill(null);
  const visibleCount = 5;
  const cardWidth = 240;
  const maxIndex = Math.ceil(carouselProducts.length / visibleCount) - 1;

  function scrollTo(direction: "left" | "right") {
    setCurrentIndex(function (current) {
      let newIndex = current;

      if (direction === "left") {
        newIndex = current - 1;
        if (newIndex < 0) newIndex = 0;
      }

      if (direction === "right") {
        newIndex = current + 1;
        if (newIndex > maxIndex) newIndex = maxIndex;
      }

      return newIndex;
    });
  }

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
      <section>
        <header className={styles.homeHeader}>
          <h1>Top 10 Products</h1>
          <nav className={styles.homeArrows}>
            <button
              onClick={() => scrollTo("left")}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
            <button
              onClick={() => scrollTo("right")}
              disabled={currentIndex === maxIndex}
            >
              ›
            </button>
          </nav>
        </header>

        <section
          className={styles.carousel}
          style={{ width: `${visibleCount * cardWidth}px` }}
        >
          <ul
            className={styles.carouselTrack}
            style={{
              transform: `translateX(-${
                currentIndex * (cardWidth + 24) * visibleCount
              }px)`,
            }}
          >
            {carouselProducts.map((_, index) => (
              <li key={index} className={styles.productCard}>
                <article>
                  <figure>
                    {/* <img src={productImg} alt="Product" /> */}
                    <Logo />
                    <figcaption>
                      <p className={styles.title}>Artwork Title</p>
                      <p className={styles.artist}>Artist Name</p>
                      <p className={styles.price}>R69</p>
                    </figcaption>
                  </figure>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </section>

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