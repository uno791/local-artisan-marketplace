import React, { useEffect, useRef, useState } from "react";
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
import { baseURL } from "../config";
import { useNavigate } from "react-router-dom";



const EditProductPage: React.FC = () => {
  const { id } = useParams();
  const TAG_LIMIT = 5; 
  const [ProdName, setProdName] = useState<string>("");
  const [Details, setDetails] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [Stock, setStock] = useState<number>(1);
  const [Width, setWidth] = useState<number>(0);
  const [Height, setHeight] = useState<number>(0);
  const [Weight, setWeight] = useState<number>(0);
  const [DelMethod, setDelMethod] = useState<number>(1);
  const [MajorCategory, setMajorCategory] = useState<string>("");
  const [Tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [noChanges, setNoChanges] = useState(false);
  
  const navigate = useNavigate();

  const originalDataRef = useRef<any>(null);
  const getDeliveryLabel = (value: number) => {
  if (value === 3) return "Delivery & Pickup";
  if (value === 1) return "Delivery Only";
  if (value === 2) return "Pickup Only";
  return "None";
};


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${baseURL}/product/${id}`);
        const data = await res.json();
        setProdName(data.product_name || "");
        setDetails(data.details || "");
        setPrice(Number(data.price) || 0);
        setStock(Number(data.stock_quantity) || 1);
        setWidth(Number(data.width) || 0);
        setHeight(Number(data.height) || 0);
        setWeight(Number(data.weight) || 0);
        setMajorCategory(data.category_name || "");
        setTags(data.tags || []);

        originalDataRef.current = {
          product_name: data.product_name || "",
          details: data.details || "",
          price: Number(data.price) || 0,
          stock_quantity: Number(data.stock_quantity) || 1,
          width: Number(data.width) || 0,
          height: Number(data.height) || 0,
          weight: Number(data.weight) || 0,
          typeOfArt: data.category_name || "",
          tags: data.tags || [],
        };
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
    if (!Width) missing.push("Width");
    if (!Height) missing.push("Height");
    if (!Weight) missing.push("Weight");
    if (!MajorCategory.trim()) missing.push("Major Category");
    if (DelMethod === 0) missing.push("Delivery Method");


    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    const payload = {
      product_name: ProdName,
      description: Details,
      price: Price,
      stock_quantity: Stock,
      width: Width,
      height: Height,
      weight: Weight,
      details: Details,
      tags: Tags,
      typeOfArt: MajorCategory,
    };

    const original = originalDataRef.current;

    const isUnchanged =
      original.product_name === payload.product_name &&
      original.details === payload.description &&
      original.price === payload.price &&
      original.stock_quantity === payload.stock_quantity &&
      original.width === payload.width &&
      original.height === payload.height &&
      original.weight === payload.weight &&
      original.typeOfArt === payload.typeOfArt &&
      JSON.stringify(original.tags) === JSON.stringify(payload.tags);

    if (isUnchanged) {
      setNoChanges(true);
      return;
    }

    try {
      const res = await fetch(`${baseURL}/editproduct/${id}`, {
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
            <EditTagsButton
              tagLimit={TAG_LIMIT}
              initialTags={Tags}
              onConfirm={(selectedTags) => setTags(selectedTags)}
            />
          </section>

          <button className={styles.confirmButton} onClick={handleConfirm}>
            confirm edits
          </button>

          {submitted && (
            <section className={styles.popupOverlay}>
              <section className={styles.popup}>
                <h2>Updated Product Info</h2>
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
                  <strong>Delivery Method:</strong> {getDeliveryLabel(DelMethod)}
                </p>

                <p>
                  <strong>Major Category:</strong> {MajorCategory}
                </p>
                <p>
                  <strong>Tags:</strong> {Tags.join(", ")}
                </p>
                <button onClick={() => navigate("/SellerHome")}>Close</button>

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

          {noChanges && (
            <section className={styles.popupOverlay}>
              <section className={styles.popup}>
                <h2>No Changes Made</h2>
                <p>You haven't made any changes to the product.</p>
                <button onClick={() => setNoChanges(false)}>Close</button>
              </section>
            </section>
          )}
        </section>
      </section>
    </section>
  );
};

export default EditProductPage;
