// src/pages/Profile.tsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profileImg from "../assets/profile.png";

import ProfileImage from "../components/ProfilePageComp/ProfileImage";
import ProfileInfo from "../components/ProfilePageComp/ProfileInfo";
import EditInfo from "../components/ProfilePageComp/EditInfo";
import ActionButtons from "../components/ProfilePageComp/ActionButtons";

import styles from "../components/ProfilePageComp/Profile.module.css";
import { useUser } from "../Users/UserContext";
import { useProfile } from "../Users/ProfileContext";
import { baseURL } from "../config";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { profile, refreshProfile } = useProfile();
  const { image, postalCode, phone, sellerStatus } = profile;

  const [showModal, setShowModal] = useState(false);

  // upload new profile image → then refresh
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.username) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await axios.put(`${baseURL}/api/user-profile-image`, {
          username: user.username,
          user_pfp: reader.result,
        });
        await refreshProfile();
      } catch (err) {
        console.error("❌ Failed to upload profile image:", err);
      }
    };
    reader.readAsDataURL(file);
  }

  // apply to be a seller → then refresh
  function goToSellerSignup() {
    navigate("/seller-signup");
  }

  // logout and clear cache
  function handleLogout() {
    localStorage.removeItem(`profileData:${user?.username}`);
    navigate("/");
  }

  return (
    <main className={styles.profile}>
      <article className={styles["profile-content"]}>
        <ProfileImage
          image={image || profileImg}
          openFilePicker={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
        />

        <ProfileInfo
          username={user?.username || ""}
          postalCode={postalCode}
          phone={phone}
          onEdit={() => setShowModal(true)}
        />

        <ActionButtons
          onBecomeSeller={goToSellerSignup}
          sellerStatus={sellerStatus}
        />

        <section className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Log Out
            <span className={styles["arrow-wrapper"]}>
              <span className={styles.arrow}></span>
            </span>
          </button>
        </section>
      </article>

      {showModal && (
        <EditInfo
          username={user?.username || ""}
          postalCode={postalCode}
          phone={phone}
          setPostalCode={() => {}}
          setPhone={() => {}}
          onClose={() => setShowModal(false)}
          refreshProfile={refreshProfile}
        />
      )}
    </main>
  );
}
