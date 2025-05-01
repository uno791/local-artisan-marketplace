import React from "react";
import styles from "../components/EditProductPageComp/EditProductPage.module.css";
import EditTagsButton from "../components/AddProductPageComp/EditTagsButton";
import ImageEditor from "../components/AddProductPageComp/ImageEditor";
import PriceInput from "../components/AddProductPageComp/PriceInput";
import ProductDetailsInput from "../components/AddProductPageComp/ProductDetailsInput";
import ProductNameInput from "../components/AddProductPageComp/ProductNameInput";
import SizeAndDimensions from "../components/AddProductPageComp/SizeAndDimensions";
import StockInput from "../components/AddProductPageComp/StockInput";
import TypeOfArtSelector from "../components/AddProductPageComp/TypeOfArtSelector";
import DeliveryOptionSelector from "../components/AddProductPageComp/DeliveryOptionSelector";

const AddProductPage: React.FC = () => {
  return (
    <section className={styles.container}>
      <h1 className={styles.pageTitle}>add product</h1>
      <section className={styles.formContainer}>
        <section className={styles.leftColumn}>
          <ProductNameInput />
          <ImageEditor />
          <PriceInput />
          <StockInput />
        </section>
        <section className={styles.rightColumn}>
          <ProductDetailsInput />
          <SizeAndDimensions />
          <DeliveryOptionSelector />
          <section className={styles.row}>
            <TypeOfArtSelector />
            <EditTagsButton />
          </section>
          <button className={styles.confirmButton}>confirm addition of new product</button>
        </section>
      </section>
    </section>
  );
};

export default AddProductPage;
