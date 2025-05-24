import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";

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
};

// renders a card with product info and link to edit page
function ProductCard({ product }: Props) {
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
      </section>
    </section>
  );
}

export default ProductCard;
