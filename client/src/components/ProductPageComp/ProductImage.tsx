import styles from "./ProductImage.module.css";

// props interface
interface ProductImageProps {
  image_url: string;
}

// component definition
function ProductImage({ image_url }: ProductImageProps) {
  return (
    <figure className={styles["product-image-container"]}>
      <img src={image_url} alt="Product" className={styles["product-image"]} />
    </figure>
  );
}

export default ProductImage;
