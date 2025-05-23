import React from "react";
import styles from "../components/EditProductPageComp/EditProductPage.module.css";
import AddTagsButton from "../components/AddProductPageComp/AddTagsButton";
import ImageAdder from "../components/AddProductPageComp/ImageAdder";
import PriceInput from "../components/AddProductPageComp/PriceInput";
import ProductDetailsInput from "../components/AddProductPageComp/ProductDetailsInput";
import ProductNameInput from "../components/AddProductPageComp/ProductNameInput";
import SizeAndDimensions from "../components/AddProductPageComp/SizeAndDimensions";
import StockInput from "../components/AddProductPageComp/StockInput";
import TypeOfArtSelector from "../components/AddProductPageComp/TypeOfArtSelector";
import DeliveryOptionSelector from "../components/EditProductPageComp/DeliveryOptionSelector";
import NavBar from "../components/SellerHomeComp/NavBar";
import { useUser } from "../Users/UserContext";
import { baseURL } from "../config";
import { useNavigate } from "react-router-dom";

// main component
const AddProductPage: React.FC = () => {
  // form state
  const [ProdName, setProdName] = React.useState("");
  const [Details, setDetails] = React.useState("");
  const [Price, setPrice] = React.useState("");
  const [Stock, setStock] = React.useState(1);
  const [Width, setWidth] = React.useState("");
  const [Height, setHeight] = React.useState("");
  const [Weight, setWeight] = React.useState("");
  const [DelMethod, setDelMethod] = React.useState(1);
  const [MajorCategory, setMajorCategory] = React.useState("");
  const [Tags, setTags] = React.useState<string[]>([]);
  const [ProductImage, setProductImage] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [missingFields, setMissingFields] = React.useState<string[]>([]);
  const [errorMessage, setErrorMessage] = React.useState("");

  // context and navigation
  const { user } = useUser();
  const navigate = useNavigate();
  const username = user?.username || "";

  // label for delivery method
  const getDeliveryLabel = (value: number) => {
    if (value === 3) return "Delivery & Pickup";
    if (value === 1) return "Delivery Only";
    if (value === 2) return "Pickup Only";
    return "None";
  };

  // validate and submit form
  const handleConfirm = async () => {
    const missing: string[] = [];

    // field checks
    if (!ProdName.trim()) missing.push("Product Name");
    if (!Details.trim()) missing.push("Product Details");
    if (!ProductImage.trim()) missing.push("Product Image"); // ✅ New line
    if (!Price.trim() || isNaN(Number(Price))) missing.push("Price");
    if (!Stock || isNaN(Stock)) missing.push("Stock");
    if (!Width.trim()) missing.push("Width");
    if (!Height.trim()) missing.push("Height");
    if (!Weight.trim()) missing.push("Weight");
    if (!MajorCategory.trim()) missing.push("Major Category");
    if (DelMethod === 0) missing.push("Delivery Method");

    // show errors if any
    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    // payload to send
    const payload = {
      username,
      product_name: ProdName,
      description: Details,
      price: parseFloat(Price),
      stock_quantity: Stock,
      image_url: ProductImage,
      width: parseFloat(Width),
      height: parseFloat(Height),
      weight: parseFloat(Weight),
      details: Details,
      tags: Tags,
      typeOfArt: MajorCategory,
      delivery_method: DelMethod,
    };

    // post to backend
    try {
      const response = await fetch(`${baseURL}/addproduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      setErrorMessage("Could not connect to backend.");
    }
  };

  // form layout and feedback messages
  return (
    <main className={styles.container}>
      <NavBar />
      <section className={styles.formContainer}>
        <section className={styles.leftColumn}>
          <ProductNameInput ProdName={ProdName} setProdName={setProdName} />
          <ImageAdder setImage={setProductImage} currentImage={ProductImage} />
          <PriceInput Price={Price} setPrice={setPrice} />
          <StockInput stock={Stock} setStock={setStock} />
        </section>

        <section className={styles.rightColumn}>
          <ProductDetailsInput Details={Details} setDetails={setDetails} />
          <SizeAndDimensions
            Width={Width}
            Height={Height}
            Weight={Weight}
            setWidth={setWidth}
            setHeight={setHeight}
            setWeight={setWeight}
          />
          <DeliveryOptionSelector
            DelMethod={DelMethod}
            setDelMethod={setDelMethod}
          />
          <section className={styles.row}>
            <TypeOfArtSelector
              TypeOfArt={MajorCategory}
              setTypeOfArt={setMajorCategory}
            />
            <AddTagsButton
              tagLimit={5}
              initialTags={Tags}
              onConfirm={(selectedTags) => setTags(selectedTags)}
            />
          </section>

          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Addition of New Product
          </button>

          {/* success popup */}
          {submitted && (
            <section className={styles.popupOverlay}>
              <article className={styles.popup}>
                <h2>Submitted Product Info</h2>
                <p>
                  <strong>Name:</strong> {ProdName}
                </p>
                <p>
                  <strong>Details:</strong> {Details}
                </p>
                <p>
                  <strong>Price:</strong> R{parseFloat(Price).toFixed(2)}
                </p>
                <p>
                  <strong>Stock:</strong> {Stock}
                </p>
                <p>
                  <strong>Width:</strong> {Width} cm
                </p>
                <p>
                  <strong>Height:</strong> {Height} cm
                </p>
                <p>
                  <strong>Weight:</strong> {Weight} kg
                </p>
                <p>
                  <strong>Delivery Method:</strong>{" "}
                  {getDeliveryLabel(DelMethod)}
                </p>
                <p>
                  <strong>Major Category:</strong> {MajorCategory}
                </p>
                <p>
                  <strong>Tags:</strong> {Tags.join(", ")}
                </p>
                <button
                  aria-label="close"
                  onClick={() => navigate("/SellerHome")}
                >
                  Close
                </button>
              </article>
            </section>
          )}

          {/* validation error popup */}
          {missingFields.length > 0 && (
            <section className={styles.popupOverlay}>
              <article className={styles.popup}>
                <h2>Please Fill Out All Required Fields</h2>
                <ul>
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
                <button aria-label="close" onClick={() => setMissingFields([])}>
                  Close
                </button>
              </article>
            </section>
          )}

          {errorMessage && (
            <section className={styles.popupOverlay}>
              <article className={styles.popup}>
                <h2>Error</h2>
                <p>{errorMessage}</p>
                <button onClick={() => setErrorMessage("")}>Close</button>
              </article>
            </section>
          )}

          {errorMessage && (
            <section className={styles.popupOverlay}>
              <article className={styles.popup}>
                <h2>Error</h2>
                <p>{errorMessage}</p>
                <button onClick={() => setErrorMessage("")}>Close</button>
              </article>
            </section>
          )}
        </section>
      </section>
    </main>
  );
};

export default AddProductPage;
