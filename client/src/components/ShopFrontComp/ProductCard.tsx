import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
};

type Props = {
  product: Product;
  onDelete: (id: number) => void;
  editable?: boolean;
};

function ProductCard({ product, onDelete, editable = true }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Link to={`/Product/${product.id}`} className={styles.cardLink}>
      <section className={styles.card} onClick={(e) => e.stopPropagation()}>
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

          {editable && (
            <>
              <Link to={`/EditProductPage/${product.id}`}>
                <button className={styles.button}>Edit Product</button>
              </Link>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                  }}
                >
                  Delete Product
                </button>
              </div>
            </>
          )}
        </section>

        {showConfirm && (
          <section className={styles.popupOverlay}>
            <article className={styles.popup}>
              <h3>Are you sure you want to delete this product?</h3>
              <p><strong>{product.name}</strong></p>
              <div className={styles.popupButtons}>
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(product.id);
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </article>
          </section>
        )}
      </section>
    </Link>
  );
}

export default ProductCard;
