import styles from "./ProductDetails.module.css";

interface DetailsProps {
  detail: string;
}

function ProductDetails({ detail }: DetailsProps) {
  return (
    <section className={styles["product-details"]}>
      <h2 className={styles["details-heading"]}>Product Details</h2>
      <p>{detail}</p>
    </section>
  );
}

export default ProductDetails;

/*import "./ProductDetails.css";

function ProductDetails() {
  return (
    <section className="product-details">
      <h2 className="details-heading">Product Details</h2>
      <ul className="details-list">
        <li>Medium: Acrylic on Canvas</li>
        <li>Year: 2024</li>
        <li>details</li>
        <li>details</li>
        <li>Ships from: Cape Town, Waterfront</li>
      </ul>
    </section>
  );
}

export default ProductDetails;*/
