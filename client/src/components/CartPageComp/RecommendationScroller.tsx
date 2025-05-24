import styles from "./RecommendationScroller.module.css";
import ProductCard, { Product } from "../SearchPageComp1/ProductCard";

// props interface
interface Props {
  products: Product[];
}

// component definition
function RecommendationScroller({ products }: Props) {
  return (
    <section className={styles.scrollerArea} aria-label="Recommended products">
      {products.map((product) => (
        <article key={product.product_id} className={styles.recommendationCard}>
          <div style={{ width: "200px", flex: "0 0 auto" }}>
            <ProductCard product={product} />
          </div>
        </article>
      ))}
    </section>
  );
}

export default RecommendationScroller;
