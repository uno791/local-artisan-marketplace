import styles from "./ProductDetails.module.css";

interface DetailsProps {
  weight: number;
  height: number;
  width: number;
}

function ProductDetails({ weight, height, width }: DetailsProps) {
  return (
    <section className={styles["product-details"]}>
      <h2 className={styles["details-heading"]}>Product Details</h2>
      <ul>
        <li>
          <strong>Width:</strong> {width} cm
        </li>
        <li>
          <strong>Height:</strong> {height} cm
        </li>
        <li>
          <strong>Weight:</strong> {weight} g
        </li>
      </ul>
    </section>
  );
}

export default ProductDetails;
