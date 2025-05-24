import styles from "./ProductImage.module.css";

interface ProductImageProps {
  image_url: string;
}

function ProductImage({ image_url }: ProductImageProps) {
  return (
    <figure className={styles["product-image-container"]}>
      <img src={image_url} alt="Product" className={styles["product-image"]} />
    </figure>
  );
}

export default ProductImage;

/*import "./ProductImage.css";

function ProductImage() {
  return (
    <figure className="product-image-container">
      <img
        src="https://uk.figuredart.com/cdn/shop/products/monkey-wearing-headphones-animals-easy-monkeys-paint-by-numbers-global-figuredart-free-shipping_597_720x.jpg?v=1648667322"
        alt="Monkey with headphones - acrylic artwork"
        className="product-image"
      />
    </figure>
  );
}

export default ProductImage;*/
