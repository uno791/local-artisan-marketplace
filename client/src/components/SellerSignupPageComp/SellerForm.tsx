import styles from "./SellerSignup.module.css";

type Props = {
  phone: string | undefined;
  setPhone: (value: string | undefined) => void;
};

function SellerForm(props: Props) {
  return (
    <form className={styles["signup-form"]}>
      <h1>Create Your Seller Account</h1>

      <label>Shop Name</label>
      <input type="text" placeholder="Enter your shop name" />

      <label>Shop Logo</label>
      <input type="file" accept="image/*" />

      <label>Shop Description</label>
      <textarea placeholder="Describe your shop" rows={4}></textarea>

      <label>Email Address</label>
      <input type="email" placeholder="Enter your email" />

      <label>Shop Location</label>
      <input type="text" placeholder="Enter your shop location" />

      {/* Instruction text */}
      <p className={styles["instruction-text"]}>
        Please email us a scanned version of your South African ID or passport. Place your username and shop name in the subject of the email for it to be reviewed.
      </p>

      <button type="submit">Create Seller Account</button>
    </form>
  );
}

export default SellerForm;
