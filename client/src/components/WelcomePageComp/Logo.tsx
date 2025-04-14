import * as React from "react";
import styles from "./WelcomePage.module.css";

export function Logo() {
  return (
    <div className={styles.logoWrapper}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ce563473ae3143012b658856f2516018aeee3a0"
        alt="Localish Logo"
        className={styles.logoImage}
      />
    </div>
  );
}
