import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
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

      <label>Phone Number</label>
      <PhoneInput
        placeholder="Enter phone number"
        defaultCountry="ZA"
        value={props.phone}
        international={true}
        countryCallingCodeEditable={false}
        onChange={function (value) {
          props.setPhone(value);
        }}
      />

      <label>Seller Name</label>
      <input type="text" placeholder="Enter your full name" />

      <label>Shop Location</label>
      <input type="text" placeholder="Enter your shop location" />

      <button type="submit">Create Seller Account</button>
    </form>
  );
}

export default SellerForm;
