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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const [image, setImage] = useState(profileImg);
  const [username, setUsername] = useState(user?.username || "");
  const [postalCode, setPostalCode] = useState("-");
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sellerStatus, setSellerStatus] = useState<
    "none" | "pending" | "approved"
  >("none");

  useEffect(() => {
    async function fetchUserInfo() {
      if (!user?.username) return;

      try {
        const res = await axios.get(`${baseURL}/getuser/${user.username}`);
        const data = res.data;
        setPostalCode(data.postal_code?.toString() || "-");
        setPhone(data.phone_no || "");

        // Updated route to fetch artisan verification status
        const artisanRes = await axios.get(
          `${baseURL}/artisan/${user.username}`
        );
        if (artisanRes.data) {
          const verified = artisanRes.data.verified;
          setSellerStatus(verified === 1 ? "approved" : "pending");
        } else {
          setSellerStatus("none");
        }
      } catch (err) {
        console.error("❌ Failed to fetch user or artisan data:", err);
      }
    }

    fetchUserInfo();
  }, [user?.username]);

  function openFilePicker() {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function goToSellerSignup() {
    navigate("/seller-signup");
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <main className={styles.profile}>
      <article className={styles["profile-content"]}>
        <ProfileImage
          image={image}
          openFilePicker={openFilePicker}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
        />

        <ProfileInfo
          username={username}
          postalCode={postalCode}
          phone={phone}
          onEdit={function () {
            setShowModal(true);
          }}
        />

        <ActionButtons
          onBecomeSeller={goToSellerSignup}
          sellerStatus={sellerStatus}
        />
      </article>

      {showModal === true && (
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
