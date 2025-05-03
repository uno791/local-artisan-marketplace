import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../components/EditProductPageComp/EditProductPage.module.css";
import EditTagsButton from "../components/EditProductPageComp/EditTagsButton";
import ImageEditor from "../components/EditProductPageComp/ImageEditor";
import PriceInput from "../components/EditProductPageComp/PriceInput";
import ProductDetailsInput from "../components/EditProductPageComp/ProductDetailsInput";
import ProductNameInput from "../components/EditProductPageComp/ProductNameInput";
import SizeAndDimensions from "../components/EditProductPageComp/SizeAndDimensions";
import StockInput from "../components/EditProductPageComp/StockInput";
import TypeOfArtSelector from "../components/EditProductPageComp/TypeOfArtSelector";
import DeliveryOptionSelector from "../components/EditProductPageComp/DeliveryOptionSelector";
import NavBar from "../components/SellerHomeComp/NavBar";

const EditProductPage: React.FC = () => {
  const { id } = useParams();

  const [ProdName, setProdName] = useState<string>("");
  const [Details, setDetails] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [Stock, setStock] = useState<number>(1);
  const [Width, setWidth] = useState<string>("");
  const [Height, setHeight] = useState<string>("");
  const [Weight, setWeight] = useState<string>("");
  const [DelMethod, setDelMethod] = useState<boolean>(true);
  const [MajorCategory, setMajorCategory] = useState<string>("");
  const [Tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/product/${id}`);
        const data = await res.json();
        setProdName(data.product_name || "");
        setDetails(data.details || "");
        setPrice(data.price || 0);
        setStock(data.stock_quantity || 1);
        setWidth(data.width?.toString() || "");
        setHeight(data.height?.toString() || "");
        setWeight(data.weight?.toString() || "");
        setMajorCategory(data.description || "");
        // TODO: fetch tags and DelMethod if available
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };
    fetchProduct();
  }, [id]);

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

    const payload = {
      product_name: ProdName,
      description: Details,
      price: Price,
      stock_quantity: Stock,
      width: parseInt(Width),
      height: parseInt(Height),
      weight: parseInt(Weight),
      details: Details,
      tags: Tags,
      typeOfArt: MajorCategory
    };

    try {
      const res = await fetch(`http://localhost:3000/editproduct/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert("Update failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Could not connect to backend.");
    }
  };

  return (
    <section className={styles.container}>
      <NavBar />
      <h1 className={styles.pageTitle}>edit product</h1>
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
            <EditTagsButton onConfirm={(selectedTags) => setTags(selectedTags)} />
          </section>

          <button className={styles.confirmButton} onClick={handleConfirm}>
            confirm edits
          </button>

          {submitted && (
            <section className={styles.popupOverlay}>
              <section className={styles.popup}>
                <h2>Updated Product Info</h2>
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
                  {missingFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
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

export default EditProductPage;
