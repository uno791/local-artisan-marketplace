import * as React from "react";
import styles from "./ImageGrid.module.css";

const dummyImages = Array.from({ length: 50 }, (_, i) => ({
  title: `Art Piece ${i + 1}`,
  price: `R${Math.floor(Math.random() * 8000 + 1500)}`,
  img: `https://via.placeholder.com/300x400?text=Art+${i + 1}`,
}));

function ImageGrid() {
  return (
    <section className={styles.imageGrid} aria-label="Image search results">
      {dummyImages.map((item, idx) => (
        <article key={idx} className={styles.card}>
          <img src={item.img} alt={item.title} />
          <h3>{item.title}</h3>
          <p className={styles.price}>{item.price}</p>
        </article>
      ))}
    </section>
  );
}

export default ImageGrid;
