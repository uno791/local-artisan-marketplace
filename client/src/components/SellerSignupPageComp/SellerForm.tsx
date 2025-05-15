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
  const [shopBannerFile, setShopBannerFile] = useState<File | null>(null);
  const [shopBannerPreview, setShopBannerPreview] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<{
    shopName?: string;
    shopDescription?: string;
    shopAddress?: string;
    email?: string;
  }>({});

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.username) {
      alert("User not logged in.");
      return;
    }

    const newErrors: typeof errors = {};

    if (!shopName.trim()) newErrors.shopName = "Shop name is required.";
    if (!shopDescription.trim()) newErrors.shopDescription = "Description is required.";
    if (!shopAddress.trim()) newErrors.shopAddress = "Shop address is required.";
    if (!email.trim() || !validateEmail(email)) newErrors.email = "Enter a valid email address.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("shop_name", shopName);
      formData.append("bio", shopDescription);
      formData.append("shop_address", shopAddress);
      if (shopLogoFile) formData.append("shop_logo", shopLogoFile);
      if (shopBannerFile) formData.append("shop_banner", shopBannerFile);
      formData.append("email", email);

      await axios.post(`${baseURL}/createartisan`, {
        username: user.username,
        shop_name: shopName,
        bio: shopDescription,
        shop_address: shopAddress,
        shop_pfp: shopLogoFile ? shopLogoFile.name : "",
        // optionally: include banner handling if backend supports it
      });

      alert("Seller account created!");
      navigate("/profile");
    } catch (err) {
      console.error("Error creating seller:", err);
      alert("Failed to create seller account.");
    }
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setShopBannerFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setShopBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setShopBannerPreview(null);
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
        className={errors.shopName ? styles["input-error"] : ""}
      />
      {errors.shopName && <p className={styles["error-text"]}>{errors.shopName}</p>}

      <label>Shop Logo</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setShopLogoFile(e.target.files?.[0] || null)}
      />

      <label>Shopfront Banner Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleBannerChange}
      />
      {shopBannerPreview && (
        <img
          src={shopBannerPreview}
          alt="Shop Banner Preview"
          className={styles["banner-preview"]}
        />
      )}

      <label>Shop Description</label>
      <textarea
        placeholder="Describe your shop"
        rows={4}
        value={shopDescription}
        onChange={(e) => setShopDescription(e.target.value)}
        className={errors.shopDescription ? styles["input-error"] : ""}
      ></textarea>
      {errors.shopDescription && (
        <p className={styles["error-text"]}>{errors.shopDescription}</p>
      )}

      <label>Email Address</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={errors.email ? styles["input-error"] : ""}
      />
      {errors.email && <p className={styles["error-text"]}>{errors.email}</p>}

      <label>Shop Location</label>
      <input
        type="text"
        placeholder="Enter your shop location"
        value={shopAddress}
        onChange={(e) => setShopAddress(e.target.value)}
        className={errors.shopAddress ? styles["input-error"] : ""}
      />
      {errors.shopAddress && (
        <p className={styles["error-text"]}>{errors.shopAddress}</p>
      )}

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

