import { useRef } from "react";
import styles from "./Header.module.css";
import NavBar from "./NavBar";
import { baseURL } from "../../config";
import { useUser } from "../../Users/UserContext";

interface Artisan {
  shop_name: string;
  bio: string;
  shop_pfp: string;
  shop_address: string;
  shop_banner: string;
}

function Header({ artisan }: { artisan: Artisan }) {
  const { user } = useUser();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const pfpInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "shop_pfp" | "shop_banner"
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.username) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      try {
        const res = await fetch(`${baseURL}/update-artisan-image`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            field,
            image: base64,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          alert("❌ Failed to update: " + data.error);
        } else {
          location.reload();
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Could not connect to server.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: artisan.shop_banner
          ? `url("${artisan.shop_banner}")`
          : `url("/fallback-banner.jpg")`,
      }}
    >
      <aside className={styles.overlay}></aside>
      <NavBar />

      <button
        className={styles.pfpEditBtn}
        onClick={() => pfpInputRef.current?.click()}
      >
        Edit Profile Picture
      </button>
      <input
        type="file"
        accept="image/*"
        ref={pfpInputRef}
        onChange={(e) => handleFileChange(e, "shop_pfp")}
        style={{ display: "none" }}
      />

      <button
        className={styles.bannerEditBtn}
        onClick={() => bannerInputRef.current?.click()}
      >
        Edit Shop Banner
      </button>
      <input
        type="file"
        accept="image/*"
        ref={bannerInputRef}
        onChange={(e) => handleFileChange(e, "shop_banner")}
        style={{ display: "none" }}
      />

      <figure className={styles.logoContainer}>
        <img
          src={artisan.shop_pfp || "/profile.png"}
          alt="Shop logo"
          className={styles.logoImage}
        />
        <figcaption className={styles.shopDetails}>
          <h1 className={styles.shopName}>{artisan.shop_name}</h1>
          <address className={styles.sellerName}>
            {artisan.shop_address}
          </address>
          <p className={styles.bio}>{artisan.bio}</p>
        </figcaption>
      </figure>
    </header>
  );
}

export default Header;
