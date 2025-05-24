import React, { useEffect, useState } from "react";
import styles from "./CartItemsList.module.css";
import axios from "axios";
import { baseURL } from "../../config";
import { useUser } from "../../Users/UserContext";

// structure for each cart item
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

// component props for updating total price externally
interface Props {
  onTotalChange: (total: number) => void;
}

function CartItemsList({ onTotalChange }: Props) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // fetch cart items for the logged-in user
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

  // calculate and report total when cart changes
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    onTotalChange(total);
  }, [cartItems, onTotalChange]);

  if (error) return <p>{error}</p>;

  // remove an item from the cart
  const handleRemove = async (product_id: number) => {
    if (!user?.username) return;

    try {
      await axios.delete(`${baseURL}/rem-cart-item`, {
        data: { username: user.username, product_id },
      });

      // update local state
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      );
    } catch (err) {
      console.error("❌ Failed to remove item from cart:", err);
      setError("Failed to remove item.");
    }
  };

  // change the quantity of an item
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

      // update local state
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
    // main container for all cart items
    <section className={styles.cartItemsArea} aria-label="Cart items">
      {cartItems.map((item) => (
        // each cart item as a card
        <article
          className={styles.cartItemCard}
          key={item.product_id}
          onClick={() => console.log("Card clicked")}
        >
          {/* product image */}
          <img
            src={item.image_url || "https://via.placeholder.com/64"}
            alt={`Thumbnail of ${item.product_name}`}
            className={styles.productImage}
          />

          {/* product name */}
          <p className={styles.productName}>
            <strong>Name: </strong>
            {item.product_name}
          </p>

          {/* sub-total price for the item */}
          <p className={styles.productPrice}>
            <strong>Sub-Total: </strong>R
            {(item.price * item.quantity).toFixed(2)}
          </p>

          {/* dropdown for quantity selection */}
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

          {/* remove button */}
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
