import styles from "./ProductInfo.module.css";
import Heading from "./ProductInfoSubComp/Heading";
import Price from "./ProductInfoSubComp/Price";
import Bio from "./ProductInfoSubComp/Bio";
import DeliveryOption from "./ProductInfoSubComp/DeliveryOption";
import AddToCart from "./ProductInfoSubComp/AddToCart";

// props include name, price, description, and full product object
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
    // main container for product information
    <section className={styles["product-info"]}>
      {/* product name */}
      <Heading name={name} />

      {/* price display */}
      <Price price={price} />

      {/* product description or bio */}
      <Bio description={description} />

      {/* delivery or pickup selector */}
      <DeliveryOption />

      {/* static product dimension info */}
      <section className={styles["product-details"]}>
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
      </section>

      {/* add to cart button */}
      <AddToCart product={product} />
    </section>
  );
}

export default ProductInfo;
