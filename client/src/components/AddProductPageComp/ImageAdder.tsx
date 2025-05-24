import React, { useRef } from "react";
import styles from "../EditProductPageComp/ImageEditor.module.css";

// props interface
interface ImageAdderProps {
  setImage: (img: string) => void;
  currentImage: string;
}

// component definition
const ImageAdder: React.FC<ImageAdderProps> = ({ setImage, currentImage }) => {
  // file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // open file dialog
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // handle image input
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className={styles.container}>
      <figure>
        <img
          src={currentImage || "/placeholder-image.jpg"}
          alt="Product Preview"
          className={styles.image}
        />
        <figcaption>
          <button
            type="button"
            onClick={openFilePicker}
            className={styles.button}
          >
            {currentImage ? "Change Image" : "Add Image"}
          </button>
        </figcaption>
      </figure>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </section>
  );
};

export default ImageAdder;
