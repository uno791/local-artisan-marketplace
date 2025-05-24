import styles from "./ProductImage.module.css";

// props for the product image url
interface ProductImageProps {
  image_url: string;
}

function ProductImage({ image_url }: ProductImageProps) {
  return (
    // container for displaying the product image
    <figure className={styles["product-image-container"]}>
      <img src={image_url} alt="Product" className={styles["product-image"]} />
    </figure>
  );
}

export default ProductImage;
