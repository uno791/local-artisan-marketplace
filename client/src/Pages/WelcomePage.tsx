import * as React from "react";
import styles from "../components/WelcomePageComp/WelcomePage.module.css";
import { Logo } from "../components/WelcomePageComp/Logo";
import { ActionButtons } from "../components/WelcomePageComp/ActionButtons";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";

interface Product {
  product_id: number;
  product_name: string;
  username: string;
  image_url: string;
  price: number;
}

function WelcomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${baseURL}/allproducts`)
      .then((res) => setProducts(res.data.slice(0, 10)))
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <main className={styles.welcomeContainer}>
      <h1 className={styles.welcomeTitle}>WELCOME TO</h1>
      <Logo />
      <p className={styles.welcomeDescription}>
        A marketplace for handmade treasures
      </p>
      <ActionButtons />

      <section className={styles.aboutSection}>
        <h2 className={styles.aboutHeading}>About Us</h2>
        <p className={styles.aboutText}>
          Localish connects you with talented local artisans and makers who create beautiful, handcrafted goods with heart. We’re all about celebrating creativity close to home—whether that’s your neighborhood or just around the corner. Our mission is to support small creative communities and bring their unique, handmade products to people who truly appreciate them. At Localish, everything we do is rooted in local pride, thoughtful design, and the joy of discovering something real.
        </p>
      </section>

      <section className={styles.productsSection}>
        <h2>Featured Products</h2>
        <ul className={styles.productsGrid}>
          {products.map((product) => (
            <li
              key={product.product_id}
              className={styles.productCard}
              role="button"
              tabIndex={0}
              onClick={openModal}
              onKeyDown={(e) => e.key === "Enter" && openModal()}
            >
              <figure>
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className={styles.productImage}
                />
                <figcaption className={styles.productInfo}>
                  <strong className={styles.productName}>
                    {product.product_name}
                  </strong>
                  <p className={styles.productPrice}>
                    R{product.price.toFixed(2)}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How do I sign up?</summary>
          <p>Click the "Sign Up" button above and fill out the registration form. You’ll receive a confirmation email to activate your account.</p>
        </details>
        <details>
          <summary>Can I sell my art here?</summary>
          <p>Yes! Once signed up, you can create listings for your products by navigating to your seller dashboard and following the steps to add new items.</p>
        </details>
        <details>
          <summary>What payment methods are accepted?</summary>
          <p>We accept major credit cards, PayPal, and other secure payment options to make transactions safe and easy.</p>
        </details>
        <details>
          <summary>How do I update or delete a product listing?</summary>
          <p>After logging in, visit your seller dashboard where you can manage your product listings including editing details or removing items.</p>
        </details>
        <details>
          <summary>Is there a fee to sell my products?</summary>
          <p>We charge a small commission on each sale to help maintain and improve the platform. There are no upfront fees to list your items.</p>
        </details>
        <details>
          <summary>How long does shipping usually take?</summary>
          <p>Shipping times vary by seller and location but typically range between 3-10 business days. Sellers usually provide estimated delivery times on their product pages.</p>
        </details>
      </section>

      <dialog ref={dialogRef} className={styles.modalDialog}>
        <article>
          <h3>Sign Up Required</h3>
          <p>You must sign up or log in to view product details.</p>
          <menu>
            <button
              type="button"
              onClick={() => {
                closeModal();
                navigate("/LogInPage");
              }}
            >
              Log In
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </menu>
        </article>
      </dialog>

      <section className={styles.ctaSection}>
        <h2>Ready to Discover Unique Handmade Treasures?</h2>
        <p>Join Localish today and support talented artisans in your community.</p>
        <menu className={styles.ctaButtons} aria-label="Call to action buttons">
          <button
            className={styles.signUpButton}
            data-testid="cta-signup"
            onClick={() => navigate("/SignUpPage")}
          >
            Sign Up Today!
          </button>
        </menu>
      </section>
    </main>
  );
}

export default WelcomePage;
