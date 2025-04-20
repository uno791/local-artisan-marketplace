import axios from "axios";
import React, { useState } from "react";
import "./AddToCart.css";
import { useUser } from "../../../Users/UserContext";

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
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const { user } = useUser();

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

    try {
      // Fetch username using user.id right here
      const response = await axios.post(`${baseURL}/get-username-by-id`, {
        user_ID: user.id,
      });

      const username = response.data.username;

      if (!username) {
        setError("Username not found. Please complete setup.");
        return;
      }

      // Then try to add to cart
      const res = await axios.post(`${baseURL}/add-to-cart`, {
        username,
        product_id: product.product_id,
      });

      setSuccess(res.data.message);
    } catch (err: any) {
      console.error("❌ Failed to add to cart:", err);
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <section className="add-to-cart-container">
      <button
        type="button"
        className="add-to-cart-button"
        onClick={handleAddToCart}
      >
        Add To Cart
      </button>
      {success && <p className="cart-success">{success}</p>}
      {error && <p className="cart-error">{error}</p>}
    </section>
  );
}

export default AddToCart;

/*import axios from "axios";
import React, { useState } from "react";
import "./AddToCart.css";
import { useEffect } from "react";
import { useUser } from "../../../Users/UserContext";

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
  //const username = localStorage.getItem("username");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [username, setUsername] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    console.log("🔍 useUser() returned:", user);
    if (user) {
      axios
        .post(`${baseURL}/get-username-by-id`, { user_ID: user.id })
        .then((res) => {
          setUsername(res.data.username);
          localStorage.setItem("username", res.data.username); // optional
        })
        .catch((err) => {
          console.error("❌ Failed to get username:", err);
          setError("Could not identify user. Please log in again.");
        });
    }
  }, [user]);

  const handleAddToCart = async () => {
    console.log("Username:", username);
    console.log("Product being added:", product);
    setError(null); // Clear previous errors

    if (!username) {
      setError("You must be logged in to add items to your cart.");
      return;
    }

    if (product.stock_quantity === 0) {
      setError("This product is currently out of stock.");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/add-to-cart`, {
        username,
        product_id: product.product_id,
      });

      console.log("Added to cart:", res.data.message);
      setSuccess(res.data.message);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to add to cart:", err);
      setError(err.response?.data?.error || "Something went wrong. Try again.");
      setSuccess(null);
    }

    //console.log("Username:", username);
    //console.log("Product being added:", product);
  };

  return (
    <section className="add-to-cart-container">
      <button
        type="button"
        className="add-to-cart-button"
        onClick={handleAddToCart}
      >
        Add To Cart
      </button>
      {success && <p className="cart-success">{success}</p>}
      {error && <p className="cart-error">{error}</p>}
    </section>
  );
}

export default AddToCart;*/

/*import "./AddToCart.css";

function AddToCart() {
  const username = localStorage.getItem("username");
  const handleAddToCart = () => {
    // Will later insert into the cart table (functionality to be added)
    console.log("Add to cart clicked");
  };

  return (
    <section className="add-to-cart-container">
      <button
        type="button"
        className="add-to-cart-button"
        onClick={handleAddToCart}
      >
        Add To Cart
      </button>
    </section>
  );
}

export default AddToCart;*/
