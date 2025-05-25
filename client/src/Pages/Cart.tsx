import styles from "../components/CartPageComp/Cart.module.css";
import CartItemsList from "../components/CartPageComp/CartItemsList";
import YouMayAlsoLike from "../components/CartPageComp/YouMayAlsoLike";
import { useState } from "react";
import axios from "axios";
import { baseURL } from "../config";
import { useUser } from "../Users/UserContext";
import { getYocoKey } from "../utils/getYocoKey";

// main cart component
function Cart() {
  // store total price of items in cart
  const [total, setTotal] = useState<number>(0);

  // get yoco public key and user from context
  const publicKey = getYocoKey();
  const { user } = useUser();

  // payment handler using Yoco popup
  const handleProceedToPayment = () => {
    if (!publicKey || !user?.username) {
      console.error("Missing Yoco public key or user.");
      return;
    }

    // add delivery cost
    const totalWithDelivery = total + 2;

    // initialize Yoco SDK
    const yoco = new (window as any).YocoSDK({
      publicKey: publicKey,
    });

    // open Yoco popup for payment
    yoco.showPopup({
      amountInCents: Math.round(totalWithDelivery * 100),
      currency: "ZAR",
      name: "Localish",
      description: "Cart Checkout (incl. R2 delivery)",
      callback: async function (result: any) {
        if (result.error) {
          console.error("Payment failed:", result.error.message);
          return;
        }

        try {
          // send payment token to backend
          const response = await axios.post(`${baseURL}/checkout`, {
            username: user.username,
            token: result.id,
          });

          // redirect to orders page
          window.location.href = "/orders";
        } catch (err: any) {
          console.error("❌ Failed to complete checkout:", err);
          alert(
            "Checkout failed: " + (err?.response?.data?.error || err.message)
          );
        }
      },
    });
  };

  return (
    <main className={styles.cartPage}>
      <section className={styles.cartPageContentRow}>
        <section className={styles.cartContentWrapper}>
          {/* header title */}
          <header className={styles.cartHeader}>
            <h1>
              <strong>Cart Items</strong>
            </h1>
          </header>

          {/* render cart items list */}
          <CartItemsList onTotalChange={setTotal} />

          {/* summary box with price breakdown */}
          <section className={styles.cartSummary}>
            <p className={styles.totalText}>
              Total: <strong>R{total.toFixed(2)}</strong> <br />
              Service Fee: <strong>R2.00</strong> <br />
              <section
                style={{
                  borderTop: "1px solid #ccc",
                  display: "block",
                  marginTop: "4px",
                  paddingTop: "4px",
                }}
              >
                Grand Total: <strong>R{(total + 2).toFixed(2)}</strong>
              </section>
            </p>

            {/* payment button */}
            <button
              className={styles.proceedButton}
              onClick={handleProceedToPayment}
              disabled={total === 0}
            >
              Pay
              <svg className={styles.svgIcon} viewBox="0 0 576 512">
                <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z" />
              </svg>
            </button>
          </section>
        </section>

        {/* you may also like section */}
        <aside className={styles.youMayAlsoLikeWrapper}>
          <YouMayAlsoLike />
        </aside>
      </section>
    </main>
  );
}

export default Cart;
