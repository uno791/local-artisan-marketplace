import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import profileImg from "../assets/profile.png";

import ProfileImage from "../components/ProfilePageComp/ProfileImage";
import ProfileInfo from "../components/ProfilePageComp/ProfileInfo";
import EditInfo from "../components/ProfilePageComp/EditInfo";
import ActionButtons from "../components/ProfilePageComp/ActionButtons";

import styles from "../components/ProfilePageComp/Profile.module.css";

function Profile() {
  const navigate = useNavigate();

  // ✅ tell TypeScript the ref is for an <input> element
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState(profileImg);
  const [username, setUsername] = useState("Mario");
  const [postalCode, setPostalCode] = useState("-");
  const [phone, setPhone] = useState("-");
  const [showModal, setShowModal] = useState(false);

  function openFilePicker() {
    // ✅ check it's not null before clicking
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

        <ActionButtons onBecomeSeller={goToSellerSignup} />
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
