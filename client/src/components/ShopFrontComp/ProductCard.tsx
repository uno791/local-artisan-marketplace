import styles from "./ShopFront.module.css";

type Props = {
  title: string;
  artist: string;
  price: string;
  category: string;
  image: string;
};

function ProductCard({ title, artist, price, category, image }: Props) {
  return (
    <section className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />
      <section className={styles.cardInfo}>
        <p className={styles.cardTitle}>{title}</p>
        <p className={styles.cardArtist}>{artist}</p>
        <p className={styles.cardPrice}>{price}</p>
        <p className={styles.cardCategory}>{category}</p>
        <button className={styles.cardButton}>Add to Cart</button>
      </section>
    </section>
  );
}

export default ProductCard;
