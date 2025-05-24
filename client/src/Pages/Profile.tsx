import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profileImg from "../assets/profile.png";

import ProfileImage from "../components/ProfilePageComp/ProfileImage";
import ProfileInfo from "../components/ProfilePageComp/ProfileInfo";
import EditInfo from "../components/ProfilePageComp/EditInfo";
import ActionButtons from "../components/ProfilePageComp/ActionButtons";

import styles from "../components/ProfilePageComp/Profile.module.css";

import { useUser } from "../Users/UserContext";
import { baseURL } from "../config";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // ref for hidden file input to upload profile pic
  const { user } = useUser(); // logged-in user info

  // state for profile image, default placeholder if none
  const [image, setImage] = useState<string>(profileImg);
  // user editable fields
  const [username, setUsername] = useState(user?.username || "");
  const [postalCode, setPostalCode] = useState("-");
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false); // toggle edit modal
  // seller verification status: none, pending approval, or approved
  const [sellerStatus, setSellerStatus] = useState<
    "none" | "pending" | "approved"
  >("none");

  // fetch user profile and seller info on component mount or username change
  useEffect(() => {
    async function fetchUserInfo() {
      if (!user?.username) return; // no username, skip fetch

      try {
        // fetch user details from backend
        const res = await axios.get(`${baseURL}/getuser/${user.username}`);
        const data = res.data;

        // update postal code and phone, default if missing
        setPostalCode(data.postal_code?.toString() || "-");
        setPhone(data.phone_no || "");

        // update profile picture or fallback to placeholder
        setImage(data.user_pfp || profileImg);

        // fetch artisan status for seller verification state
        const artisanRes = await axios.get(
          `${baseURL}/artisan/${user.username}`
        );
        if (artisanRes.data) {
          setSellerStatus(
            artisanRes.data.verified === 1 ? "approved" : "pending"
          );
        } else {
          setSellerStatus("none");
        }
      } catch (err) {
        console.error("❌ Failed to fetch user or artisan data:", err);
      }
    }

    fetchUserInfo();
  }, [user?.username]);

  // open the hidden file input dialog
  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // handle profile image file upload and send to backend
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && user?.username) {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64 = reader.result as string;
        setImage(base64); // update image preview

        try {
          // upload new profile image
          await axios.put(`${baseURL}/api/user-profile-image`, {
            username: user.username,
            user_pfp: base64,
          });
          console.log("✅ Profile image uploaded");
        } catch (err) {
          console.error("❌ Failed to upload profile image:", err);
        }
      };

      reader.readAsDataURL(file);
    }
  }

  // navigate to seller signup page
  function goToSellerSignup() {
    navigate("/seller-signup");
  }

  // close edit profile modal
  function closeModal() {
    setShowModal(false);
  }

  // clear storage and navigate to homepage on logout
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <main className={styles.profile}>
      <article className={styles["profile-content"]}>
        {/* Profile picture with file picker */}
        <ProfileImage
          image={image}
          openFilePicker={openFilePicker}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
        />

        {/* User information with edit option */}
        <ProfileInfo
          username={username}
          postalCode={postalCode}
          phone={phone}
          onEdit={() => setShowModal(true)}
        />

        {/* Action buttons including seller signup */}
        <ActionButtons
          onBecomeSeller={goToSellerSignup}
          sellerStatus={sellerStatus}
        />

        {/* Logout button */}
        <section className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Log Out
            <span className={styles["arrow-wrapper"]}>
              <span className={styles.arrow}></span>
            </span>
          </button>
        </section>
      </article>

      {/* Modal to edit user information */}
      {showModal && (
        <EditInfo
          username={username}
          postalCode={postalCode}
          phone={phone}
          setUsername={setUsername}
          setPostalCode={setPostalCode}
          setPhone={setPhone}
          onClose={closeModal}
        />
      )}
    </main>
  );
}

export default Profile;
