import * as React from "react";
import { useState } from "react";
import styles from "./Header.module.css";

function Header() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <header className={styles.header}>
      <h1 className={styles.h1}>From Your Cart</h1>
      <button
        className={`${styles.button} ${
          isButtonHovered ? styles.buttonHovered : ""
        }`}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        cancel
      </button>
    </header>
  );
}

export default Header;
