import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SellerSignup.module.css";
import { useUser } from "../../Users/UserContext";
import { baseURL } from "../../config";
import { Link } from "react-router-dom";

function SellerForm() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopLogoFile, setShopLogoFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.username) {
      alert("❌ User not logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("shop_name", shopName);
    formData.append("bio", shopDescription);
    formData.append("shop_address", shopAddress);
    formData.append("shop_pfp", shopLogoFile ? shopLogoFile.name : "");
    formData.append("email", email); // optional if needed

    try {
      await axios.post(`${baseURL}/createartisan`, {
        username: user.username,
        shop_name: shopName,
        bio: shopDescription,
        shop_address: shopAddress,
        shop_pfp: shopLogoFile ? shopLogoFile.name : "",
      });
      alert("✅ Seller account created!");
      navigate("/profile"); // ✅ Redirect to profile after form submission
    } catch (err) {
      console.error("❌ Error creating seller:", err);
      alert("Failed to create seller account.");
    }
  }

  return (
    <form className={styles["signup-form"]} onSubmit={handleSubmit}>
      <h1>Create Your Seller Account</h1>

      <label>Shop Name</label>
      <input
        type="text"
        placeholder="Enter your shop name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
      />

      <label>Shop Logo</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setShopLogoFile(e.target.files?.[0] || null)}
      />

      <label>Shop Description</label>
      <textarea
        placeholder="Describe your shop"
        rows={4}
        value={shopDescription}
        onChange={(e) => setShopDescription(e.target.value)}
      ></textarea>

      <label>Email Address</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Shop Location</label>
      <input
        type="text"
        placeholder="Enter your shop location"
        value={shopAddress}
        onChange={(e) => setShopAddress(e.target.value)}
      />

      <p className={styles["instruction-text"]}>
        Please email us a scanned version of your South African ID or passport.
        Place your username and shop name in the subject of the email for it to
        be reviewed.
      </p>
      <button type="submit">Create Seller Account</button>
      <Link to="/Profile" className={styles["verification-link"]}></Link>
    </form>
  );
}

export default SellerForm;
