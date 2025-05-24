import * as React from "react";
import styles from "../components/WelcomePageComp/WelcomePage.module.css";
import { Logo } from "../components/WelcomePageComp/Logo";
import { ActionButtons } from "../components/WelcomePageComp/ActionButtons";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";

// define product structure
interface Product {
  product_id: number;
  product_name: string;
  username: string;
  image_url: string;
  price: number;
}

// main welcome page component
function WelcomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null); // modal ref
  const navigate = useNavigate();

  // fetch first 10 products to show as featured
  useEffect(() => {
    axios
      .get(`${baseURL}/allproducts`)
      .then((res) => setProducts(res.data.slice(0, 10)))
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  // open modal dialog
  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  // close modal dialog
  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <main className={styles.welcomeContainer}>
      {/* title and branding */}
      <h1 className={styles.welcomeTitle}>WELCOME TO</h1>
      <Logo />
      <p className={styles.welcomeDescription}>
        A marketplace for handmade treasures
      </p>

      {/* navigation buttons */}
      <ActionButtons />

      {/* about section */}
      <section className={styles.aboutSection}>
        <h2 className={styles.aboutHeading}>About Us</h2>
        <p className={styles.aboutText}>
Localish connects you with talented local artists and creators of all kinds — from painters and photographers to digital illustrators and designers. We're here to celebrate creativity rooted in your community, whether that's right next door or across town. Our mission is to support small creative scenes and showcase the unique work they produce, bringing it to people who truly value originality. At Localish, everything we do is grounded in local pride, artistic expression, and the thrill of discovering something authentic.
        </p>
      </section>

      {/* featured product previews */}
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

     {/* FAQ section */}
<section className={styles.faqSection}>
  <h2>Frequently Asked Questions</h2>

  <details>
    <summary>How do I sign up?</summary>
    <p>
      You just need to sign up with your Google account or email, then select your interests to get started.
    </p>
  </details>

  <details>
    <summary>Can I sell my art here?</summary>
    <p>
      Yes! Once signed up, you can create listings for your products by
      navigating to your seller dashboard and following the steps to add
      new items.
    </p>
  </details>

  <details>
    <summary>What payment methods are accepted?</summary>
    <p>
      All payments are processed securely through Yoco.
    </p>
  </details>

  <details>
    <summary>Is there a fee to sell my products?</summary>
    <p>
      No, there are no fees to sell your products on the platform.
    </p>
  </details>

  <details>
    <summary>How long does shipping usually take?</summary>
    <p>
      Shipping times vary by seller and location but typically range
      between 3–10 business days. Sellers usually provide estimated
      delivery times on their product pages.
    </p>
  </details>

  <details>
    <summary>Can I buy art even if I'm not a seller?</summary>
    <p>
      Absolutely! You don’t need to be a seller to purchase artwork. Just browse, add items to your cart, and check out when you're ready.
    </p>
  </details>
</section>


      {/* modal for unauthenticated users */}
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

      {/* call to action */}
      <section className={styles.ctaSection}>
        <h2>Ready to Discover Unique Handmade Treasures?</h2>
        <p>
          Join Localish today and support talented artisans in your community.
        </p>
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
