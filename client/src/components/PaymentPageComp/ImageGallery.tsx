import * as React from "react";
import { useState } from "react";
import styles from "./ImageGallery.module.css";
import { GalleryItem } from "./GalleryItem";

export interface GalleryImage {
  img: string;
  title: string;
  artist: string;
}

function ImageGallery() {
  //const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [images] = useState<GalleryImage[]>([
    {
      img: "https://via.placeholder.com/300x400?text=Art+1",
      title: "Abstract Shapes",
      artist: "Harshil",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+2",
      title: "Golden Silence",
      artist: "Ziya",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Art+3",
      title: "Peaceful Linework",
      artist: "Yabsira",
    },
  ]);

  return (
    <section
      className={styles.gallerySection}
      role="region"
      aria-label="Image Gallery"
    >
      <ul className={styles.galleryList}>
        {images?.map((image, index) => (
          <GalleryItem key={`${image.title}-${index}`} image={image} />
        ))}
      </ul>
    </section>
  );
}

export default ImageGallery;
