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
  products: Product[];
};

function ProductGrid({ products }: Props) {
  return (
    // grid container for product cards
    <section className={styles.grid}>
      {products.map((product) => (
        // each product is wrapped in a link to its detail page
        <Link
          key={product.id}
          to={`/Product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {/* render product card */}
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
