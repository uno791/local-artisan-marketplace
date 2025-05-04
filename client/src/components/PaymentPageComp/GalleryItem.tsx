import * as React from "react";
import styles from "./ImageGallery.module.css";
import { GalleryImage } from "./ImageGallery";

interface GalleryItemProps {
  image: GalleryImage;
}

export function GalleryItem({ image }: GalleryItemProps) {
  return (
    <li className={styles.galleryItem}>
      <figure className={styles.imageContainer}>
        <img
          className={styles.galleryImage}
          src={image.img}
          alt={image.title}
          loading="lazy"
        />
      </figure>
      <h3 className={styles.imageTitle}>{image.title}</h3>
      <p className={styles.artistName}>{image.artist}</p>
    </li>
  );
}
