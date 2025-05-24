import SellerForm from "../components/SellerSignupPageComp/SellerForm";
import styles from "../components/SellerSignupPageComp/SellerSignup.module.css";

function SellerSignup() {
  return (
    <main className={styles["seller-signup"]}>
      <SellerForm />
    </main>
  );
}

export default SellerSignup;
