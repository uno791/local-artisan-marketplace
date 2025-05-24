// src/components/EditProductPageComp/ImageEditor.tsx

import React, { useRef } from "react";
import styles from "./ImageEditor.module.css";

// props include the image and function to update it
interface ImageEditorProps {
  productId: string | undefined;
  initialImage: string;
  setImage: (img: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  initialImage,
  setImage,
}) => {
  // ref to hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // opens native file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // reads selected file and converts to base64
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
    // image preview with button to change it
    <section className={styles.container}>
      <figure>
        <img
          src={initialImage || "/placeholder-image.jpg"}
          alt="Current product"
          className={styles.image}
        />
        <figcaption>
          <button
            type="button"
            onClick={openFilePicker}
            className={styles.button}
          >
            Change Image
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

export default ImageEditor;
