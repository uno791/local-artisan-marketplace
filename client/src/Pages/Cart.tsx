import styles from "../components/CartPageComp/Cart.module.css";
import CartItemsList from "../components/CartPageComp/CartItemsList";
import YouMayAlsoLike from "../components/CartPageComp/YouMayAlsoLike";

function Cart() {
  return (
    <main className={styles.cartPage}>
      <section className={styles.cartPageContentRow}>
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
