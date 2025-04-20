import styles from "./CartItemsList.module.css";
function CartItemsList() {
  return (
    <section className={styles.cartItemsArea} aria-label="Cart items">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
        <article
          className={styles.cartItemCard}
          key={index}
          onClick={() => console.log("Card clicked")}
        >
          <img
            src="https://via.placeholder.com/64"
            alt="Product thumbnail"
            className={styles.productImage}
          />
          <p className={styles.productName}>
            <strong>Name: </strong>Sample Product
          </p>
          <p className={styles.productPrice}>
            <strong>Sub-Total: </strong>R90
          </p>

          <select
            defaultValue={1}
            className={styles.quantityDropdown}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              console.log("Quantity changed to", Number(e.target.value))
            }
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>

          <button
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation(); //prevent click from bubbling to card
              console.log("Remove clicked");
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
