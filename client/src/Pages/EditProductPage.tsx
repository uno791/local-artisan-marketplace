import React from "react";
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
  return (
    <div className={styles.container}>
      <NavBar />
      <h1 className={styles.pageTitle}>edit product</h1>
      <div className={styles.formContainer}>
        <div className={styles.leftColumn}>
          <ProductNameInput />
          <ImageEditor />
          <PriceInput />
          <StockInput />
        </div>
        <div className={styles.rightColumn}>
          <ProductDetailsInput />
          <SizeAndDimensions />
          <DeliveryOptionSelector />
          <div className={styles.row}>
            <TypeOfArtSelector />
            <EditTagsButton />
          </div>
          <button className={styles.confirmButton}>confirm edits</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
