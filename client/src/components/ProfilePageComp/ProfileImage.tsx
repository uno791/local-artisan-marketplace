import styles from "./Profile.module.css";

// props for profile image, file handling, and input ref
type Props = {
  image: string;
  openFilePicker: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ProfileImage(props: Props) {
  return (
    // container for profile image and edit button
    <section className={styles["profile-img-section"]}>
      {/* current profile image */}
      <img src={props.image} alt="Profile" className={styles["profile-img"]} />

      {/* button to trigger file picker */}
      <button className={styles["edit-img-btn"]} onClick={props.openFilePicker}>
        Edit
      </button>

      {/* hidden file input for image upload */}
      <input
        type="file"
        accept="image/*"
        ref={props.fileInputRef}
        onChange={props.handleImageChange}
        aria-label="upload profile image"
        style={{ display: "none" }}
      />
    </section>
  );
}

export default ProfileImage;
