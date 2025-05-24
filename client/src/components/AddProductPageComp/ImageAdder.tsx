// src/components/AddProductPageComp/ImageAdder.tsx

import React, { useRef } from "react";
import styles from "../EditProductPageComp/ImageEditor.module.css";

// props control the current image and the image update function
interface ImageAdderProps {
  setImage: (img: string) => void;
  currentImage: string;
}

const ImageAdder: React.FC<ImageAdderProps> = ({ setImage, currentImage }) => {
  // ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // programmatically opens the file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // reads selected image and updates as base64
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
        {/* shows current image or fallback */}
        <img
          src={currentImage || "/placeholder-image.jpg"}
          alt="Product Preview"
          className={styles.image}
        />
        <figcaption>
          {/* opens file input when clicked */}
          <button
            type="button"
            onClick={openFilePicker}
            className={styles.button}
          >
            {currentImage ? "Change Image" : "Add Image"}
          </button>
        </figcaption>
      </figure>

      {/* hidden file input triggered by button */}
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
