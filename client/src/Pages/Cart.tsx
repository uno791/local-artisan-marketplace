import styles from "../components/CartPageComp/Cart.module.css";
import CartItemsList from "../components/CartPageComp/CartItemsList";
import YouMayAlsoLike from "../components/CartPageComp/YouMayAlsoLike";
import { useState } from "react";
import axios from "axios";
import { baseURL } from "../config";
import { useUser } from "../Users/UserContext";
import { getYocoKey } from "../utils/getYocoKey";

function Cart() {
  const [total, setTotal] = useState<number>(0);

  //const publicKey = import.meta.env.VITE_YOCO_PUBLIC_KEY;
  
const publicKey = getYocoKey();
  const { user } = useUser();

  const handleProceedToPayment = () => {
    if (!publicKey || !user?.username) {
      console.error("Missing Yoco public key or user.");
      return;
    }

    const totalWithDelivery = total + 2; // Add R2.00 delivery fee
    console.log("Proceeding to payment for user:", user);
    console.log("Total (cart): R" + total.toFixed(2));
    console.log("Total with delivery: R" + totalWithDelivery.toFixed(2));

    const yoco = new (window as any).YocoSDK({
      publicKey: publicKey,
    });

    yoco.showPopup({
      amountInCents: Math.round(totalWithDelivery * 100),
      currency: "ZAR",
      name: "Localish",
      description: "Cart Checkout (incl. R2 delivery)",
      callback: async function (result: any) {
        console.log("Yoco callback triggered", result);

        if (result.error) {
          console.error("Payment failed:", result.error.message);
          return;
        }

        console.log("Sending token to backend:", result.id);

        try {
          const response = await axios.post(`${baseURL}/checkout`, {
            username: user.username,
            token: result.id,
          });

          console.log("Checkout response:", response.data);

          // Navigate to BuyerOrders
          window.location.href = "/orders";
        } catch (err: any) {
          console.error("❌ Failed to complete checkout:", err);
          alert("Checkout failed: " + (err?.response?.data?.error || err.message));
        }
      },
    });
  };

  return (
    <main className={styles.cartPage}>
      <section className={styles.cartPageContentRow}>
        <section className={styles.cartContentWrapper}>
          <header className={styles.cartHeader}>
            <h1>
              <strong>Cart Items</strong>
            </h1>
          </header>

          <CartItemsList onTotalChange={setTotal} />

          <section className={styles.cartSummary}>
            <p className={styles.totalText}>
              Total: <strong>R{total.toFixed(2)}</strong> <br />
              Delivery: <strong>R2.00</strong> <br />
              <span style={{ borderTop: "1px solid #ccc", display: "block", marginTop: "4px", paddingTop: "4px" }}>
                Grand Total: <strong>R{(total + 2).toFixed(2)}</strong>
              </span>
            </p>
            <button
              className={styles.proceedButton}
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          </section>
        </section>

        <aside className={styles.youMayAlsoLikeWrapper}>
          <YouMayAlsoLike />
        </aside>
      </section>
    </main>
  );
}

export default Cart;


/*import styles from "../components/CartPageComp/Cart.module.css";
import CartItemsList from "../components/CartPageComp/CartItemsList";

function Cart() {
  return (
    <main className={styles.cartPage}>
      <section className={styles.cartContentWrapper}>
        <header className={styles.cartHeader}>
          <h1>
            <strong>Cart Items</strong>
          </h1>
        </header>

        <CartItemsList />

        <section className={styles.cartSummary}>
          <p className={styles.totalText}>
            Total: <strong>R270</strong>
          </p>
          <button className={styles.proceedButton}>Proceed to Payment</button>
        </section>
      </section>
    </main>
  );
}

export default Cart;*/
