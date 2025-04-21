import * as React from "react";
import styles from "./Image.module.css";

export function Logo() {
  return (
    <figure className={styles.logoWrapper}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ce563473ae3143012b658856f2516018aeee3a0"
        alt="Localish Logo"
        className={styles.logoImage}
      />
    </figure>
  );
}
