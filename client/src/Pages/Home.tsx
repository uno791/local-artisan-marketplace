import "../components/HomePageComp/Home.css";
import { useState, useEffect } from "react";
import productImg from "../assets/localish-product.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

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
  //const gridProducts = new Array(5).fill(null);
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
  const baseURL = import.meta.env.VITE_API_BASE_URL;
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
    <main className="home">
      <section>
        <header className="home-header">
          <h1>Top 10 Products</h1>
          <nav className="home-arrows">
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
          className="carousel"
          style={{ width: `${visibleCount * cardWidth}px` }}
        >
          <ul
            className="carousel-track"
            style={{
              transform: `translateX(-${
                currentIndex * (cardWidth + 24) * visibleCount
              }px)`,
            }}
          >
            {carouselProducts.map((_, index) => (
              <li key={index} className="product-card">
                <article>
                  <figure>
                    <img src={productImg} alt="Product" />
                    <figcaption>
                      <p className="title">Artwork Title</p>
                      <p className="artist">Artist Name</p>
                      <p className="price">R69</p>
                    </figcaption>
                  </figure>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section className="all-products">
        <h2>All Products</h2>
        <ul className="all-products-grid">
          {gridProducts.map((product, index) => (
            <li key={index} className="product-card">
              <Link
                to={`/Product/${product.product_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article>
                  <figure>
                    <img src={product.image_url || productImg} alt="Product" />
                    <figcaption>
                      <p className="title">{product.product_name}</p>
                      <p className="artist">{product.username}</p>
                      <p className="price">{`R${product.price}`}</p>
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
