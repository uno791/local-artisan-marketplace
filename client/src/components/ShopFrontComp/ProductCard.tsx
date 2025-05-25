import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";

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
        </section>
      </section>
    </Link>
  );
}

export default ProductCard;
