import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import styles from "./ShopFront.module.css";

type Product = {
  id: number;
  title: string;
  artist: string;
  price: string;
  image: string;
};

type Props = {
  products: Product[]; // list of product objects to display
};

function ProductGrid({ products }: Props) {
  return (
    <section className={styles.grid}>
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/Product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ProductCard
            title={product.title}
            artist={product.artist}
            price={product.price}
            image={product.image}
          />
        </Link>
      ))}
    </section>
  );
}

export default ProductGrid;
