// src/pages/AddProductPage.tsx

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

const AddProductPage: React.FC = () => {
  const [ProdName, setProdName] = React.useState("");
  const [Details, setDetails] = React.useState("");
  const [Price, setPrice] = React.useState(0);
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

  const { user } = useUser();
  const navigate = useNavigate();
  const username = user?.username || "";

  const getDeliveryLabel = (value: number) => {
    if (value === 3) return "Delivery & Pickup";
    if (value === 1) return "Delivery Only";
    if (value === 2) return "Pickup Only";
    return "None";
  };

  const handleConfirm = async () => {
    const missing: string[] = [];

    if (!ProdName.trim()) missing.push("Product Name");
    if (!Details.trim()) missing.push("Product Details");
    if (!Price || isNaN(Price)) missing.push("Price");
    if (!Stock || isNaN(Stock)) missing.push("Stock");
    if (!Width.trim()) missing.push("Width");
    if (!Height.trim()) missing.push("Height");
    if (!Weight.trim()) missing.push("Weight");
    if (!MajorCategory.trim()) missing.push("Major Category");
    if (DelMethod === 0) missing.push("Delivery Method");

    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    const payload = {
      username,
      product_name: ProdName,
      description: Details,
      price: Price,
      stock_quantity: Stock,
      image_url: ProductImage,
      width: parseInt(Width),
      height: parseInt(Height),
      weight: parseInt(Weight),
      details: Details,
      tags: Tags,
      typeOfArt: MajorCategory,
      delivery_method: DelMethod,
    };

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
        alert("Failed to add product: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Could not connect to backend.");
    }
  };

  return (
    <main className={styles.container}>
      <NavBar />
      <header>
        <h1 className={styles.pageTitle}>Add Product</h1>
      </header>

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
                  <strong>Price:</strong> R{Price.toFixed(2)}
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
        </section>
      </section>
    </main>
  );
};

export default AddProductPage;
