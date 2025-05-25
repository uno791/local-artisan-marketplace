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
    <section className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.title,
            category: product.artist,
            price: product.price,
            image: product.image,
          }}
        />
      ))}
    </section>
  );
}

export default ProductGrid;
