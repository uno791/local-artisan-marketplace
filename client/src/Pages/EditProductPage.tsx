import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ProdName, setProdName] = useState("");
  const [Details, setDetails] = useState("");
  const [Price, setPrice] = useState(0);
  const [Stock, setStock] = useState(1);
  const [Width, setWidth] = useState(0);
  const [Height, setHeight] = useState(0);
  const [Weight, setWeight] = useState(0);
  const [DelMethod, setDelMethod] = useState(1);
  const [MajorCategory, setMajorCategory] = useState("");
  const [Tags, setTags] = useState<string[]>([]);
  const [ProductImage, setProductImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [noChanges, setNoChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

        console.log("Fetched product data:", data); // ✅ Debug

        const deliveryVal = parseInt(data.delivery_method, 10);
        const safeDeliveryVal = Number.isNaN(deliveryVal) ? 1 : deliveryVal;

        setProdName(data.product_name || "");
        setDetails(data.details || "");
        setPrice(Number(data.price) || 0);
        setStock(Number(data.stock_quantity) || 1);
        setWidth(Number(data.width) || 0);
        setHeight(Number(data.height) || 0);
        setWeight(Number(data.weight) || 0);
        setDelMethod(safeDeliveryVal);
        setMajorCategory(data.category_name || "");
        setTags(data.tags || []);
        setProductImage(data.product_image || data.image_url || "");

        originalDataRef.current = {
          product_name: data.product_name || "",
          details: data.details || "",
          price: Number(data.price) || 0,
          stock_quantity: Number(data.stock_quantity) || 1,
          width: Number(data.width) || 0,
          height: Number(data.height) || 0,
          weight: Number(data.weight) || 0,
          delivery_method: safeDeliveryVal,
          typeOfArt: data.category_name || "",
          tags: data.tags || [],
          product_image: data.product_image || data.image_url || "",
        };
      } catch (err) {
        console.error("❌ Failed to load product:", err);
        setErrorMessage("Failed to load product details.");
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
    if (Width === null || Width === undefined || isNaN(Width)) missing.push("Width");
    if (Height === null || Height === undefined || isNaN(Height)) missing.push("Height");
    if (Weight === null || Weight === undefined || isNaN(Weight)) missing.push("Weight");
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
      delivery_method: DelMethod,
      tags: Tags,
      typeOfArt: MajorCategory,
      product_image: ProductImage,
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
      original.delivery_method === payload.delivery_method &&
      original.typeOfArt === payload.typeOfArt &&
      JSON.stringify(original.tags) === JSON.stringify(payload.tags) &&
      original.product_image === payload.product_image;

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
        setErrorMessage(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      setErrorMessage("Could not connect to backend.");
    }
  };

  return (
    <main className={styles.container}>
      <NavBar />
      <section className={styles.formContainer}>
        <section className={styles.leftColumn}>
          <ProductNameInput ProdName={ProdName} setProdName={setProdName} />
          <ImageEditor
            productId={id}
            initialImage={ProductImage}
            setImage={setProductImage}
          />
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
              tagLimit={5}
              initialTags={Tags}
              onConfirm={(selectedTags) => setTags(selectedTags)}
            />
          </section>

          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Edits
          </button>

          {submitted && (
            <section className={styles.popupOverlay}>
              <article className={styles.popup}>
                <h2>Updated Product Info</h2>
                <dl>
                  <dt>Name:</dt>
                  <dd className={styles.value}>{ProdName}</dd>
                  <dt>Details:</dt>
                  <dd className={styles.value}>{Details}</dd>
                  <dt>Price:</dt>
                  <dd className={styles.value}>R{Price.toFixed(2)}</dd>
                  <dt>Stock:</dt>
                  <dd className={styles.value}>{Stock}</dd>
                  <dt>Width:</dt>
                  <dd className={styles.value}>{Width} cm</dd>
                  <dt>Height:</dt>
                  <dd className={styles.value}>{Height} cm</dd>
                  <dt>Weight:</dt>
                  <dd className={styles.value}>{Weight} kg</dd>
                  <dt>Delivery Method:</dt>
                  <dd className={styles.value}>
                    {getDeliveryLabel(DelMethod)}
                  </dd>
                  <dt>Major Category:</dt>
                  <dd className={styles.value}>{MajorCategory}</dd>
                  <dt>Tags:</dt>
                  <dd className={styles.value}>{Tags.join(", ")}</dd>
                </dl>
                <button onClick={() => navigate("/SellerHome")}>Close</button>
              </article>
            </section>
          )}

          {missingFields.length > 0 && (
            <section className={styles.popupOverlay}>
              <article className={styles.popup}>
                <h2>Please Fill Out All Required Fields</h2>
                <ul>
                  {missingFields.map((field, i) => (
                    <li key={i}>{field}</li>
                  ))}
                </ul>
                <button onClick={() => setMissingFields([])}>Close</button>
              </article>
            </section>
          )}

          {noChanges && (
            <section className={styles.popupOverlay}>
              <article className={styles.popup}>
                <h2>No Changes Made</h2>
                <p>You haven't made any changes to the product.</p>
                <button onClick={() => setNoChanges(false)}>Close</button>
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

export default EditProductPage;
