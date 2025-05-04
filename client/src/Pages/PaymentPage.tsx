import * as React from "react";
import styles from "../components/PaymentPageComp/PaymentPage.module.css";

import Header from "../components/PaymentPageComp/Header";
import ImageGallery from "../components/PaymentPageComp/ImageGallery";
import ProductPrice from "../components/PaymentPageComp/ProductPrice";
import DeliveryPrice from "../components/PaymentPageComp/DeliveryPrice";
import TotalPrice from "../components/PaymentPageComp/TotalPrice";
import PurchaseButton from "../components/PaymentPageComp/PurchaseButton";

function PaymentPage() {
  return (
    <main className={styles.container} aria-label="Payment page">
      <Header />

      <ImageGallery />

      <section className={styles.summary} aria-label="Order summary">
        <ProductPrice />
        <DeliveryPrice />
        <TotalPrice />
      </section>

      <PurchaseButton />
    </main>
  );
}

export default PaymentPage;
