import ProductCard from "./ProductCard";
import styles from "./ShopFront.module.css";

type Product = {
  id: number;
  title: string;
  artist: string;
  price: string;
  category: string;
  image: string;
};

type Props = {
  products: Product[];
};

function ProductGrid({ products }: Props) {
  return (
    <section className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          artist={product.artist}
          price={product.price}
          category={product.category}
          image={product.image}
        />
      ))}
    </section>
  );
}

export default ProductGrid;
