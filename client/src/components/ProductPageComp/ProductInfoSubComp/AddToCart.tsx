import axios from "axios";
import React, { useState } from "react";
import styles from "./AddToCart.module.css";
import { useUser } from "../../../Users/UserContext";
import { baseURL } from "../../../config";

// props include product info to be added to cart
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

function AddToCart({ product }: AddToCartProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useUser();

  // handles add to cart action
  const handleAddToCart = async () => {
    console.log("User from useUser():", user);
    setError(null);
    setSuccess(null);

    // user must be logged in
    if (!user) {
      setError("You must be logged in to add items to your cart.");
      return;
    }

    // can't add if out of stock
    if (product.stock_quantity === 0) {
      setError("This product is currently out of stock.");
      return;
    }

    const username = user.username;

    // username must be set
    if (!username) {
      setError("Username not found. Please complete setup.");
      return;
    }

    // send request to add product to cart
    const res = await axios.post(`${baseURL}/add-to-cart`, {
      username,
      product_id: product.product_id,
    });

    setSuccess(res.data.message);
  };

  return (
    // button and status messages container
    <section className={styles["add-to-cart-container"]}>
      <button
        type="button"
        className={styles["add-to-cart-button"]}
        onClick={handleAddToCart}
      >
        Add To Cart
      </button>

      {/* show success message */}
      {success && <p className={styles["cart-success"]}>{success}</p>}

      {/* show error message */}
      {error && <p className={styles["cart-error"]}>{error}</p>}
    </section>
  );
}

export default AddToCart;
