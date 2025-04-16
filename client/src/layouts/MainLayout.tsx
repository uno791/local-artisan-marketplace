import NavBar from "../components/HomePageComp/NavBar";
import Footer from "../components/HomePageComp/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet /> {}
      <Footer />
    </>
  );
}
