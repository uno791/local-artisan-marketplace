import styles from "./RecommendationScroller.module.css";
import ProductCard, { Product } from "../SearchPageComp1/ProductCard";

// props include a list of products to recommend
interface Props {
  products: Product[];
}

function RecommendationScroller({ products }: Props) {
  return (
    // horizontal scroll area for recommended products
    <section className={styles.scrollerArea} aria-label="Recommended products">
      {products.map((product) => (
        // each product rendered inside a card
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
