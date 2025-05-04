// src/components/SearchPageComp1/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image_url: string;
  username: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/Product/${product.product_id}`} className={styles.card}>
    <img
      src={product.image_url}
      alt={product.product_name}
      className={styles.image}
    />
    <div className={styles.info}>
      <h4 className={styles.title}>{product.product_name}</h4>
      <p className={styles.artist}>By {product.username}</p>
      <p className={styles.price}>R{product.price}</p>
    </div>
  </Link>
);

export default ProductCard;
