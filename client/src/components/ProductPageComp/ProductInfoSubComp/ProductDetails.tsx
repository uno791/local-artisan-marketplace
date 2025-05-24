import styles from "./ProductDetails.module.css";

// props for displaying size and weight info
interface DetailsProps {
  weight: number;
  height: number;
  width: number;
}

function ProductDetails({ weight, height, width }: DetailsProps) {
  return (
    // container for product measurements
    <section className={styles["product-details"]}>
      {/* section heading */}
      <h2 className={styles["details-heading"]}>Product Details</h2>

      {/* list of dimensions */}
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
