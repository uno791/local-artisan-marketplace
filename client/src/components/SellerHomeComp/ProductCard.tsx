import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

// product data type
type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
};

// props for card
type Props = {
  product: Product;
  onDelete: (id: number) => void;
};

function ProductCard({ product, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className={styles.card}>
      <section className={styles.imageBox}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <section className={styles.placeholder}>387 × 320</section>
        )}
      </section>

      <section className={styles.info}>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <p className={styles.category}>{product.category}</p>

        {/* edit button linking to product form */}
        <Link to={`/EditProductPage/${product.id}`}>
          <button className={styles.button}>Edit Product</button>
        </Link>

        <div style={{ marginTop: "0.5rem" }}>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => setShowConfirm(true)}
          >
            Delete Product
          </button>
        </div>
      </section>

      {showConfirm && (
        <section className={styles.popupOverlay}>
          <article className={styles.popup}>
            <h3>Are you sure you want to delete this product?</h3>
            <p>
              <strong>{product.name}</strong>
            </p>
            <div className={styles.popupButtons}>
              <button
                className={`${styles.button} ${styles.deleteButton}`}
                onClick={() => onDelete(product.id)}
              >
                Yes, Delete
              </button>
              <button
                className={styles.button}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </article>
        </section>
      )}
    </section>
  );
}

export default ProductCard;
