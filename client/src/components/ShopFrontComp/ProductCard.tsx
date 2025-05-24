import styles from "./ShopFront.module.css";

type Props = {
  title: string; // product title
  artist: string; // name of artisan
  price: string; // product price (formatted)
  category?: string; // optional category
  image: string; // product image url
};

function ProductCard({ title, artist, price, category, image }: Props) {
  return (
    <section className={styles.card}>
      {/* image section */}
      <section className={styles.cardImageWrapper}>
        {image ? (
          <img src={image} alt={title} className={styles.cardImage} />
        ) : null}
      </section>

      {/* product information */}
      <section className={styles.cardInfo}>
        <p className={styles.cardTitle}>{title}</p>
        <p className={styles.cardArtist}>{artist}</p>
        <p className={styles.cardPrice}>{price}</p>
        {category && <p className={styles.cardCategory}>{category}</p>}
      </section>
    </section>
  );
}

export default ProductCard;
