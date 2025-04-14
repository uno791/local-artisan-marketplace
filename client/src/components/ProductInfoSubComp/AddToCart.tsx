import { useNavigate } from "react-router-dom";
import "./AddToCart.css";

function AddToCart() {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate("/cart");
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

export default AddToCart;
