// src/components/SearchPageComp1/ProductCard.tsx
// src/components/SearchPageComp1/ProductCard.tsx
// BO: Enhanced ProductCard.tsx with click tracking, preserving original structure
// src/components/SearchPageComp1/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { useUser } from "../../Users/UserContext";
import axios from "axios";
import { baseURL } from "../../config";

export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image_url: string;
  username: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { user } = useUser();

  const handleClick = async () => {
    if (!user?.username) return;
    try {
      await axios.post(`${baseURL}/track-click-main`, {
        username: user.username,
        productId: product.product_id,
      });
      await axios.post(`${baseURL}/track-click-minor`, {
        username: user.username,
        productId: product.product_id,
      });
    } catch (err) {
      console.error("BO: Click tracking failed:", err);
    }
  };

  return (
    <Link
      to={`/Product/${product.product_id}`}
      className={styles.card}
      onClick={handleClick}
    >
      <img
        src={product.image_url}
        alt={product.product_name}
        className={styles.image}
      />
      <article className={styles.info}>
        <h4 className={styles.title}>{product.product_name}</h4>
        <p className={styles.artist}>By {product.username}</p>
        <p className={styles.price}>R{product.price}</p>
      </article>
    </Link>
  );
};

export default ProductCard;
