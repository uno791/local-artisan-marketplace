import React, { useEffect, useState } from "react";
import styles from "./CartItemsList.module.css";
import axios from "axios";
import { baseURL } from "../../config";
import { useUser } from "../../Users/UserContext";

interface CartItem {
  product_id: number;
  quantity: number;
  added_at: string;
  product_name: string;
  price: number;
  image_url: string;
  stock: number;
  seller_username: string;
}

interface Props {
  onTotalChange: (total: number) => void;
}
function CartItemsList({ onTotalChange }: Props) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.username) return;

      try {
        const res = await axios.get(`${baseURL}/cart/${user.username}`);
        setCartItems(res.data);
      } catch (err: any) {
        console.error("❌ Failed to fetch cart items:", err);
        setError("Failed to load cart.");
      }
    };

    fetchCart();
  }, [user?.username]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    onTotalChange(total);
  }, [cartItems, onTotalChange]);

  if (error) return <p>{error}</p>;

  const handleRemove = async (product_id: number) => {
    if (!user?.username) return;

    try {
      await axios.delete(`${baseURL}/rem-cart-item`, {
        data: { username: user.username, product_id },
      });

      // Remove item from local state
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      );
    } catch (err) {
      console.error("❌ Failed to remove item from cart:", err);
      setError("Failed to remove item.");
    }
  };

  const handleQuantityChange = async (
    product_id: number,
    newQuantity: number
  ) => {
    if (!user?.username) return;

    try {
      await axios.put(`${baseURL}/upd-cart-item`, {
        username: user.username,
        product_id,
        quantity: newQuantity,
      });

      // Update local state
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
      setError("Failed to update item quantity.");
    }
  };
  return (
    <section className={styles.cartItemsArea} aria-label="Cart items">
      {cartItems.map((item) => (
        <article
          className={styles.cartItemCard}
          key={item.product_id}
          onClick={() => console.log("Card clicked")}
        >
          <img
            src={item.image_url || "https://via.placeholder.com/64"}
            alt={`Thumbnail of ${item.product_name}`}
            className={styles.productImage}
          />
          <p className={styles.productName}>
            <strong>Name: </strong>
            {item.product_name}
          </p>
          <p className={styles.productPrice}>
            <strong>Sub-Total: </strong>R
            {(item.price * item.quantity).toFixed(2)}
          </p>

          <select
            defaultValue={item.quantity}
            className={styles.quantityDropdown}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const newQty = Number(e.target.value);
              handleQuantityChange(item.product_id, newQty);
            }}
          >
            {Array.from(
              { length: Math.min(item.stock, 10) },
              (_, i) => i + 1
            ).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>

          <button
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(item.product_id);
            }}
          >
            Remove
          </button>
        </article>
      ))}
    </section>
  );
}

export default CartItemsList;
