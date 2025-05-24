import SellerForm from "../components/SellerSignupPageComp/SellerForm";
import styles from "../components/SellerSignupPageComp/SellerSignup.module.css";

function SellerSignup() {
  return (
    <main className={styles["seller-signup"]}>
      {/* Render the seller signup form */}
      <SellerForm />
    </main>
  );
}

export default SellerSignup;
