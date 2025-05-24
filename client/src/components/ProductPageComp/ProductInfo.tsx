import styles from "./ProductInfo.module.css";
import Heading from "./ProductInfoSubComp/Heading";
import Price from "./ProductInfoSubComp/Price";
import Bio from "./ProductInfoSubComp/Bio";
import DeliveryOption from "./ProductInfoSubComp/DeliveryOption";
import AddToCart from "./ProductInfoSubComp/AddToCart";

interface ProductInfoProps {
  name: string;
  price: number;
  description: string;
  details: string;
  product: {
    product_id: number;
    product_name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
    username: string;
    width: number;
    height: number;
    weight: number;
  };
}

function ProductInfo({
  name,
  price,
  description,
  details,
  product,
}: ProductInfoProps) {
  return (
    <section className={styles["product-info"]}>
      <Heading name={name} />
      <Price price={price} />
      <Bio description={description} />
      <DeliveryOption />

      {/* ✅ Product Dimensions (merged into Product Details section) */}
      <div className={styles["product-details"]}>
        <h3>Product Details</h3>
        <ul>
          <li>
            <strong>Width:</strong> {product.width} cm
          </li>
          <li>
            <strong>Height:</strong> {product.height} cm
          </li>
          <li>
            <strong>Weight:</strong> {product.weight} kg
          </li>
        </ul>
      </div>

      <AddToCart product={product} />
    </section>
  );
}

export default ProductInfo;
