import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";

// product shape for props
type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
};

type Props = {
  product: Product;
};

function ProductCard({ product }: Props) {
  return (
    // product card wrapper
    <section className={styles.card}>
      {/* image section */}
      <section className={styles.imageBox}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          // fallback if no image is provided
          <section className={styles.placeholder}>387 × 320</section>
        )}
      </section>

      {/* product info section */}
      <section className={styles.info}>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <p className={styles.category}>{product.category}</p>

        {/* link to edit page using product id */}
        <Link to={`/EditProductPage/${product.id}`}>
          <button className={styles.button}>edit product</button>
        </Link>
      </section>
    </section>
  );
}

export default ProductCard;
