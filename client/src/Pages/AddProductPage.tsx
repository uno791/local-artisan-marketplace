import React from "react";
import styles from "../components/EditProductPageComp/EditProductPage.module.css";
import EditTagsButton from "../components/AddProductPageComp/AddTagsButton";
import ImageEditor from "../components/AddProductPageComp/ImageAdder";
import PriceInput from "../components/AddProductPageComp/PriceInput";
import ProductDetailsInput from "../components/AddProductPageComp/ProductDetailsInput";
import ProductNameInput from "../components/AddProductPageComp/ProductNameInput";
import SizeAndDimensions from "../components/AddProductPageComp/SizeAndDimensions";
import StockInput from "../components/AddProductPageComp/StockInput";
import TypeOfArtSelector from "../components/AddProductPageComp/TypeOfArtSelector";
import DeliveryOptionSelector from "../components/AddProductPageComp/DeliveryOptionSelector";
import NavBar from "../components/SellerHomeComp/NavBar";
import AddTagsButton from "../components/AddProductPageComp/AddTagsButton";
import { useUser } from "../Users/UserContext";

const AddProductPage: React.FC = () => {
  const [ProdName, setProdName] = React.useState<string>("");
  const [Details, setDetails] = React.useState<string>("");
  const [Price, setPrice] = React.useState<number>(0);
  const [Stock, setStock] = React.useState<number>(1);
  const [Width, setWidth] = React.useState<string>("");
  const [Height, setHeight] = React.useState<string>("");
  const [Weight, setWeight] = React.useState<string>("");
  const [DelMethod, setDelMethod] = React.useState<boolean>(true);
  const [MajorCategory, setMajorCategory] = React.useState<string>(""); // renamed from TypeOfArt
  const [Tags, setTags] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState(false);
  const [missingFields, setMissingFields] = React.useState<string[]>([]);

  const { user } = useUser();
  const [username] = React.useState(user?.username || "");

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

    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    if (!username) {
      alert("Username not set. Please log in again.");
      return;
    }

    const payload = {
      username: username,
      product_name: ProdName,
      description: Details, // 👈 Description is now ONLY Details
      price: Price,
      stock_quantity: Stock,
      image_url: "",
      width: parseInt(Width),
      height: parseInt(Height),
      weight: parseInt(Weight),
      details: Details,
      tags: Tags,
      typeOfArt: MajorCategory
    };

    try {
      const response = await fetch("http://localhost:3000/addproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Product submitted:", data);
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
    <section className={styles.container}>
      <NavBar />
      <h1 className={styles.pageTitle}>add product</h1>
      <section className={styles.formContainer}>
        <section className={styles.leftColumn}>
          <ProductNameInput ProdName={ProdName} setProdName={setProdName} />
          <ImageEditor />
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
            <AddTagsButton onConfirm={(selectedTags) => setTags(selectedTags)} />
          </section>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            confirm addition of new productS
          </button>

          {submitted && (
            <section className={styles.popupOverlay}>
              <section className={styles.popup}>
                <h2>Submitted Product Info</h2>
                <p><strong>Name:</strong> {ProdName}</p>
                <p><strong>Details:</strong> {Details}</p>
                <p><strong>Price:</strong> R{Price.toFixed(2)}</p>
                <p><strong>Stock:</strong> {Stock}</p>
                <p><strong>Width:</strong> {Width} cm</p>
                <p><strong>Height:</strong> {Height} cm</p>
                <p><strong>Weight:</strong> {Weight} kg</p>
                <p><strong>Delivery Method:</strong> {DelMethod ? "Delivery" : "Pickup"}</p>
                <p><strong>Major Category:</strong> {MajorCategory}</p>
                <p><strong>Tags:</strong> {Tags.join(", ")}</p>
                <button onClick={() => setSubmitted(false)}>Close</button>
              </section>
            </section>
          )}

          {missingFields.length > 0 && (
            <section className={styles.popupOverlay}>
              <section className={styles.popup}>
                <h2>Please Fill Out All Required Fields</h2>
                <ul>
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
                <button onClick={() => setMissingFields([])}>Close</button>
              </section>
            </section>
          )}
        </section>
      </section>
    </section>
  );
};

export default AddProductPage;
