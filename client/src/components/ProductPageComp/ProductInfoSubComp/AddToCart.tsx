import axios from "axios";
import React, { useState } from "react";
import styles from "./AddToCart.module.css";
import { useUser } from "../../../Users/UserContext";
import { baseURL } from "../../../config";

// props interface
interface AddToCartProps {
  product: {
    product_id: number;
    product_name: string;
    price: number;
    stock_quantity: number;
    image_url: string;
    username: string;
  };
}

// component definition
function AddToCart({ product }: AddToCartProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useUser();

  // handler for adding item to cart
  const handleAddToCart = async () => {
    console.log("User from useUser():", user);
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("You must be logged in to add items to your cart.");
      return;
    }

    if (product.stock_quantity === 0) {
      setError("This product is currently out of stock.");
      return;
    }

    const username = user.username;

    if (!username) {
      setError("Username not found. Please complete setup.");
      return;
    }

    const res = await axios.post(`${baseURL}/add-to-cart`, {
      username,
      product_id: product.product_id,
    });

    setSuccess(res.data.message);
  };

  return (
    <section className={styles["add-to-cart-container"]}>
      <button
        type="button"
        className={styles["add-to-cart-button"]}
        onClick={handleAddToCart}
      >
        Add To Cart
      </button>
      {success && <p className={styles["cart-success"]}>{success}</p>}
      {error && <p className={styles["cart-error"]}>{error}</p>}
    </section>
  );
}

export default AddToCart;
