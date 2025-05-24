// import necessary hooks and modules
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

// main profile component
function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  // state variables
  const [image, setImage] = useState<string>(profileImg);
  const [username, setUsername] = useState(user?.username || "");
  const [postalCode, setPostalCode] = useState("-");
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sellerStatus, setSellerStatus] = useState<
    "none" | "pending" | "approved"
  >("none");

  // fetch user and artisan info on mount
  useEffect(() => {
    async function fetchUserInfo() {
      if (!user?.username) return;

      try {
        const res = await axios.get(`${baseURL}/getuser/${user.username}`);
        const data = res.data;

        setPostalCode(data.postal_code?.toString() || "-");
        setPhone(data.phone_no || "");

        if (data.user_pfp) {
          setImage(data.user_pfp);
        } else {
          setImage(profileImg);
        }

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

  // open file picker to select new profile image
  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // handle image file selection and upload
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && user?.username) {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64 = reader.result as string;
        setImage(base64);

        try {
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

  // close the modal for editing info
  function closeModal() {
    setShowModal(false);
  }

  // handle logout and redirect to landing
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <main className={styles.profile}>
      <article className={styles["profile-content"]}>
        {/* profile image section */}
        <ProfileImage
          image={image}
          openFilePicker={openFilePicker}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
        />

        {/* profile details section */}
        <ProfileInfo
          username={username}
          postalCode={postalCode}
          phone={phone}
          onEdit={() => setShowModal(true)}
        />

        {/* action buttons for becoming a seller */}
        <ActionButtons
          onBecomeSeller={goToSellerSignup}
          sellerStatus={sellerStatus}
        />

        {/* logout button */}
        <section className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Log Out
            <span className={styles["arrow-wrapper"]}>
              <span className={styles.arrow}></span>
            </span>
          </button>
        </section>
      </article>

      {/* edit info modal */}
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
