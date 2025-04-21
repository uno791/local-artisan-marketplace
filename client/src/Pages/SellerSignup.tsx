import { useState } from "react";

import SellerForm from "../components/SellerSignupPageComp/SellerForm";
import styles from "../components/SellerSignupPageComp/SellerSignup.module.css";

function SellerSignup() {
  const [phone, setPhone] = useState<string>();

  return (
    <main className={styles["seller-signup"]}>
      <SellerForm phone={phone} setPhone={setPhone} />
    </main>
  );
}

export default SellerSignup;
