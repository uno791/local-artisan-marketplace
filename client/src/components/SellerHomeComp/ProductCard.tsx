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
    <div className={styles.card}>
      <div className={styles.imageBox}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className={styles.placeholder}>387 × 320</div>
        )}
      </div>
      <div className={styles.info}>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <p className={styles.category}>{product.category}</p>
        <Link to={"/EditProductPage"}>
          <button className={styles.button}>Edit Product</button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
