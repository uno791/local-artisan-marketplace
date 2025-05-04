import * as React from "react";
import { useState } from "react";
import styles from "./PurchaseButton.module.css";

function PurchaseButton() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <footer className={styles.footer}>
      <button
        className={styles.button}
        onMouseEnter={() => setHovered("purchase")}
        onMouseLeave={() => setHovered(null)}
        style={{
          transform: hovered === "purchase" ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.2s",
        }}
      >
        Purchase
      </button>
    </footer>
  );
}

export default PurchaseButton;
